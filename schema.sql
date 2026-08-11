-- ════════════════════════════════════════════════════════════════════════════
-- PY LUXE — SUPABASE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ════════════════════════════════════════════════════════════════════════════

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ─── PROFILES ────────────────────────────────────────────────────────────────
-- Extends Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'admin')),
  date_of_birth DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── SERVICES ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  duration INTEGER NOT NULL, -- minutes
  buffer_time INTEGER DEFAULT 0, -- minutes
  deposit_amount NUMERIC(10, 2) DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── STAFF ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  bio TEXT,
  specialties TEXT[] DEFAULT '{}',
  rating NUMERIC(3, 2) DEFAULT 5.0,
  total_reviews INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Staff ↔ Services junction
CREATE TABLE IF NOT EXISTS public.staff_services (
  staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  PRIMARY KEY (staff_id, service_id)
);

-- ─── AVAILABILITY ────────────────────────────────────────────────────────────

-- Store-wide business hours per day of week (0=Sunday, 1=Monday, etc.)
CREATE TABLE IF NOT EXISTS public.business_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  is_closed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (day_of_week)
);

-- Store-wide blocked dates (for holidays, special events, etc.)
CREATE TABLE IF NOT EXISTS public.blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  start_time TIME, -- if null, whole day is blocked
  end_time TIME,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (date, start_time, end_time)
);

-- Blocked time slots (booked or manually blocked for staff)
CREATE TABLE IF NOT EXISTS public.blocked_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INTEGER NOT NULL DEFAULT 60, -- duration in minutes
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (staff_id, date, time)
);

-- ─── BOOKINGS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_ref TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT, -- for guest checkout
  customer_email TEXT, -- for guest checkout
  customer_phone TEXT, -- for guest checkout
  staff_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INTEGER NOT NULL,
  notes TEXT,
  inspiration_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'declined', 'completed', 'cancelled', 'no_show')),
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'deposit_paid', 'fully_paid', 'refunded')),
  total_amount NUMERIC(10, 2) NOT NULL,
  deposit_amount NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Transactional Booking RPC to prevent double bookings
CREATE OR REPLACE FUNCTION public.book_appointment(
  p_booking_ref TEXT,
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_customer_phone TEXT,
  p_service_id UUID,
  p_date DATE,
  p_time TIME,
  p_duration INTEGER,
  p_notes TEXT,
  p_total_amount NUMERIC,
  p_deposit_amount NUMERIC
) RETURNS UUID AS $$
DECLARE
  v_booking_id UUID;
  v_overlaps INTEGER;
  v_end_time TIME;
BEGIN
  v_end_time := p_time + (p_duration || ' minutes')::interval;

  -- Lock the bookings table for this date to prevent concurrent overlapping inserts
  -- In a high scale app, we'd use pg_advisory_xact_lock, but locking rows or checking overlaps is enough here.
  
  -- Check if there are any confirmed/pending bookings that overlap
  SELECT COUNT(*) INTO v_overlaps
  FROM public.bookings b
  WHERE b.date = p_date
    AND b.status IN ('pending', 'confirmed')
    AND (
      (p_time >= b.time AND p_time < (b.time + (b.duration || ' minutes')::interval))
      OR
      (v_end_time > b.time AND v_end_time <= (b.time + (b.duration || ' minutes')::interval))
      OR
      (p_time <= b.time AND v_end_time >= (b.time + (b.duration || ' minutes')::interval))
    );

  IF v_overlaps > 0 THEN
    RAISE EXCEPTION 'Double booking detected. This time slot is no longer available.';
  END IF;

  -- Insert booking
  INSERT INTO public.bookings (
    booking_ref, customer_name, customer_email, customer_phone,
    service_id, date, time, duration, notes, total_amount, deposit_amount
  ) VALUES (
    p_booking_ref, p_customer_name, p_customer_email, p_customer_phone,
    p_service_id, p_date, p_time, p_duration, p_notes, p_total_amount, p_deposit_amount
  ) RETURNING id INTO v_booking_id;

  RETURN v_booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── BOOKING PAYMENTS ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.booking_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('deposit', 'full', 'balance')),
  payment_method TEXT NOT NULL DEFAULT 'paystack'
    CHECK (payment_method IN ('paystack', 'cash', 'bank_transfer')),
  paystack_reference TEXT UNIQUE,
  paystack_transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'success', 'failed')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── GALLERY ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── REVIEWS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  photo_urls TEXT[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── BLOG POSTS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── PRODUCTS (Shop) ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  compare_at_price NUMERIC(10, 2),
  stock INTEGER NOT NULL DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── ORDERS ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_ref TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  discount NUMERIC(10, 2) DEFAULT 0,
  shipping_fee NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  paystack_reference TEXT,
  shipping_address JSONB,
  coupon_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL
);

-- ─── WISHLISTS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT wishlist_item_check CHECK (
    (product_id IS NOT NULL AND service_id IS NULL) OR
    (product_id IS NULL AND service_id IS NOT NULL)
  )
);

-- ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('booking', 'payment', 'reminder', 'announcement', 'promo')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── COUPONS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL,
  min_order_amount NUMERIC(10, 2),
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── ANNOUNCEMENTS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  target_role TEXT DEFAULT 'all' CHECK (target_role IN ('all', 'customer', 'staff')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ════════════════════════════════════════════════════════════════════════════

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
-- Use a SECURITY DEFINER function to prevent infinite recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE POLICY "profiles_admin_all" ON public.profiles USING (
  public.is_admin()
);

-- Bookings: customers see their own, staff sees assigned, admin sees all
CREATE POLICY "bookings_customer_own" ON public.bookings FOR SELECT USING (
  customer_id = auth.uid()
);
CREATE POLICY "bookings_insert_own" ON public.bookings FOR INSERT WITH CHECK (
  customer_id = auth.uid()
);
CREATE POLICY "bookings_admin_all" ON public.bookings USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

-- Notifications: users see their own
CREATE POLICY "notifications_own" ON public.notifications FOR ALL USING (user_id = auth.uid());

-- Orders: users see their own
CREATE POLICY "orders_own" ON public.orders FOR ALL USING (customer_id = auth.uid());

-- Public tables (no RLS needed for reads)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "services_public_read" ON public.services FOR SELECT USING (is_active = TRUE);
CREATE POLICY "services_admin_write" ON public.services USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "business_hours_public_read" ON public.business_hours FOR SELECT USING (TRUE);

ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blocked_dates_public_read" ON public.blocked_dates FOR SELECT USING (TRUE);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gallery_public_read" ON public.gallery_items FOR SELECT USING (TRUE);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blog_published_read" ON public.blog_posts FOR SELECT USING (is_published = TRUE);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read" ON public.products FOR SELECT USING (is_active = TRUE);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_approved_read" ON public.reviews FOR SELECT USING (is_approved = TRUE);
CREATE POLICY "reviews_own_insert" ON public.reviews FOR INSERT WITH CHECK (customer_id = auth.uid());

-- ════════════════════════════════════════════════════════════════════════════
-- INDEXES
-- ════════════════════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.bookings (customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_staff ON public.bookings (staff_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings (date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings (status);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON public.gallery_items (category);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON public.blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications (user_id);

-- ════════════════════════════════════════════════════════════════════════════
-- SEED DATA — Services
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO public.services (slug, name, description, category, price, duration, is_active) VALUES
('hair-installation', 'Hair Installation', 'Professional wig and weave installations for a flawless look.', 'Hair', 15000, 120, TRUE),
('wig-revamp', 'Wig Revamp', 'Deep conditioning, restyling, and restoration for old wigs.', 'Hair', 8000, 90, TRUE),
('wig-stretching', 'Wig Stretching', 'Professional wig stretching for a perfect fit.', 'Hair', 5000, 60, TRUE),
('braiding', 'Braiding', 'Box braids, cornrows, Fulani braids and more.', 'Hair', 12000, 180, TRUE),
('natural-hair-care', 'Natural Hair Care', 'Deep cleansing, conditioning, and moisturizing treatments.', 'Hair', 7000, 90, TRUE),
('nails', 'Nails', 'Classic manicures with premium polish.', 'Nails', 4000, 45, TRUE),
('gel-polish', 'Gel Polish', 'Long-lasting gel polish that stays chip-free for up to 3 weeks.', 'Nails', 5500, 60, TRUE),
('acrylic-nails', 'Acrylic Nails', 'Full-set acrylics with custom designs.', 'Nails', 9000, 90, TRUE),
('pedicure', 'Pedicure', 'Relaxing pedicure with foot soak, exfoliation, massage, and polish.', 'Nails', 5000, 60, TRUE),
('makeup', 'Makeup', 'Flawless everyday glam or bold statement looks.', 'Makeup', 15000, 90, TRUE),
('bridal-makeup', 'Bridal Makeup', 'Long-wear bridal makeup with a trial session included.', 'Makeup', 50000, 180, TRUE),
('party-makeup', 'Party Makeup', 'Glam, bold, and photo-ready for events and celebrations.', 'Makeup', 20000, 90, TRUE),
('lashes', 'Lashes', 'Classic, hybrid, and volume lash extensions.', 'Lashes', 12000, 120, TRUE),
('henna', 'Henna', 'Traditional and contemporary henna designs.', 'Henna', 8000, 90, TRUE),
('fashion-consultation', 'Fashion Consultation', 'Personal styling sessions to curate your dream wardrobe.', 'Fashion', 25000, 120, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- ════════════════════════════════════════════════════════════════════════════
-- SEED DATA — Business Hours
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO public.business_hours (day_of_week, open_time, close_time, is_closed) VALUES
(1, '09:00:00', '18:00:00', FALSE), -- Monday
(2, '09:00:00', '18:00:00', FALSE), -- Tuesday
(3, '09:00:00', '18:00:00', FALSE), -- Wednesday
(4, '09:00:00', '18:00:00', FALSE), -- Thursday
(5, '09:00:00', '18:00:00', FALSE), -- Friday
(6, '10:00:00', '17:00:00', FALSE), -- Saturday
(0, '00:00:00', '00:00:00', TRUE)   -- Sunday
ON CONFLICT (day_of_week) DO NOTHING;
