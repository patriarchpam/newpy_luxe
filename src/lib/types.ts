// ─── Database Types ───────────────────────────────────────────────────────────

export type UserRole = "customer" | "staff" | "admin";
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "declined"
  | "completed"
  | "cancelled"
  | "no_show";
export type PaymentStatus = "pending" | "deposit_paid" | "fully_paid" | "refunded";
export type PaymentMethod = "paystack" | "cash" | "bank_transfer";
export type PaymentType = "deposit" | "full";
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type NotificationType = "booking" | "payment" | "reminder" | "announcement" | "promo";

// ─── Profile ──────────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  date_of_birth?: string;
  created_at: string;
  updated_at: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export interface ServiceDB {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  buffer_time: number;
  deposit_amount: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

// ─── Staff ────────────────────────────────────────────────────────────────────

export interface StaffMember {
  id: string;
  profile_id: string;
  bio?: string;
  specialties: string[];
  rating: number;
  total_reviews: number;
  is_active: boolean;
  created_at: string;
  profile?: Profile;
}

// ─── Booking ──────────────────────────────────────────────────────────────────

export interface Booking {
  id: string;
  booking_ref: string;
  customer_id?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  staff_id?: string;
  service_id: string;
  date: string;
  time: string;
  duration: number;
  notes?: string;
  inspiration_image_url?: string;
  status: BookingStatus;
  payment_status: PaymentStatus;
  total_amount: number;
  deposit_amount: number;
  created_at: string;
  updated_at: string;
  // Relations
  customer?: Profile;
  staff?: StaffMember;
  service?: ServiceDB;
  payments?: BookingPayment[];
}

// ─── Payment ──────────────────────────────────────────────────────────────────

export interface BookingPayment {
  id: string;
  booking_id: string;
  amount: number;
  payment_type: PaymentType;
  payment_method: PaymentMethod;
  paystack_reference?: string;
  paystack_transaction_id?: string;
  status: "pending" | "success" | "failed";
  paid_at?: string;
  created_at: string;
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

export interface GalleryItem {
  id: string;
  title?: string;
  image_url: string;
  category: string;
  tags?: string[];
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

// ─── Review ───────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  booking_id: string;
  customer_id: string;
  service_id: string;
  rating: number;
  comment: string;
  photo_urls?: string[];
  is_verified: boolean;
  is_approved: boolean;
  created_at: string;
  customer?: Profile;
  service?: ServiceDB;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url?: string;
  category: string;
  tags?: string[];
  author_id: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  author?: Profile;
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  compare_at_price?: number;
  stock: number;
  images: string[];
  tags?: string[];
  is_active: boolean;
  created_at: string;
}

// ─── Order ────────────────────────────────────────────────────────────────────

export interface Order {
  id: string;
  order_ref: string;
  customer_id: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  paystack_reference?: string;
  shipping_address?: Address;
  created_at: string;
  customer?: Profile;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product?: Product;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
}

// ─── Notification ─────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

// ─── Coupon ───────────────────────────────────────────────────────────────────

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount?: number;
  max_uses?: number;
  used_count: number;
  valid_from: string;
  valid_until?: string;
  is_active: boolean;
}

// ─── Address ──────────────────────────────────────────────────────────────────

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code?: string;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface AnalyticsSummary {
  total_revenue: number;
  total_bookings: number;
  total_customers: number;
  revenue_change: number;
  bookings_change: number;
  customers_change: number;
}

// ─── Availability ─────────────────────────────────────────────────────────────

export interface BusinessHours {
  id: string;
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
  created_at: string;
}

export interface BlockedDate {
  id: string;
  date: string;
  start_time?: string;
  end_time?: string;
  reason?: string;
  created_at: string;
}

// ─── Form Types ───────────────────────────────────────────────────────────────

export interface BookingFormData {
  service_id: string;
  staff_id?: string;
  date: string;
  time: string;
  notes?: string;
  inspiration_image?: File;
  payment_type: PaymentType;
  full_name: string;
  email: string;
  phone: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  full_name: string;
  email: string;
  phone?: string;
  password: string;
  confirm_password: string;
}
