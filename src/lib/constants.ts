export const BRAND = {
  name: "PY Luxe",
  tagline: "Beauty. Style. Confidence.",
  description: "Hair, nails, makeup and henna services in Abuja.",
  location: "Abuja, Nigeria",
  primary_service_location: "Veritas University, Abuja",
  whatsapp: "2347055034041",
  display_whatsapp: "07055034041",
  url: "https://pyluxe.com", // Adjust as necessary
} as const;

export const COLORS = {
  black: "#171717",
  blush: "#F8E8EC",
  cream: "#FFF9F5",
  white: "#FFFFFF",
  gold: "#C9A227",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export type ServiceCategory = "Hair" | "Nails" | "Makeup" | "Henna";

export type Service = {
  id: string;
  category: ServiceCategory;
  name: string;
  description: string;
  price: number | "Price available on request";
  duration?: string; // e.g. "2 hours"
  image?: string;
};

export const SERVICES: Service[] = [
  {
    id: "hair-braids",
    category: "Hair",
    name: "Knotless Braids",
    description: "Elegant, protective knotless braids styled to perfection.",
    price: "Price available on request",
    image: "/images/hair.png",
  },
  {
    id: "hair-cornrows",
    category: "Hair",
    name: "Cornrows",
    description: "Classic and intricate cornrow designs.",
    price: "Price available on request",
    image: "/images/hair.png",
  },
  {
    id: "hair-wig",
    category: "Hair",
    name: "Wig Styling & Installation",
    description: "Flawless wig installations and styling.",
    price: "Price available on request",
    image: "/images/hair.png",
  },
  {
    id: "nails-acrylic",
    category: "Nails",
    name: "Acrylic Nails",
    description: "Beautifully sculpted acrylic nail extensions.",
    price: "Price available on request",
    image: "/images/nails.png",
  },
  {
    id: "nails-gel",
    category: "Nails",
    name: "Gel Polish",
    description: "Long-lasting, glossy gel polish application.",
    price: "Price available on request",
    image: "/images/nails.png",
  },
  {
    id: "nails-art",
    category: "Nails",
    name: "Custom Nail Art",
    description: "Intricate, hand-painted nail designs.",
    price: "Price available on request",
    image: "/images/nails.png",
  },
  {
    id: "makeup-soft-glam",
    category: "Makeup",
    name: "Soft Glam",
    description: "Enhance your natural beauty with a flawless soft glam look.",
    price: "Price available on request",
    image: "/images/makeup.png",
  },
  {
    id: "makeup-eyebrow-carving",
    category: "Makeup",
    name: "Eyebrow Carving & Shaping",
    description: "Precision eyebrow carving, trimming, and shaping for defined, gorgeous arches.",
    price: "Price available on request",
    image: "/images/eyebrows.png",
  },
  {
    id: "makeup-event-glam",
    category: "Makeup",
    name: "Event / Bridal Glam",
    description: "Show-stopping makeup for your special occasions.",
    price: "Price available on request",
    image: "/images/makeup.png",
  },
  {
    id: "henna-simple",
    category: "Henna",
    name: "Simple Henna Design",
    description: "Elegant and minimal henna artistry.",
    price: "Price available on request",
    image: "/images/henna.png",
  },
  {
    id: "henna-intricate",
    category: "Henna",
    name: "Intricate / Bridal Henna",
    description: "Detailed, traditional-inspired intricate henna patterns.",
    price: "Price available on request",
    image: "/images/henna.png",
  },
];

export const GALLERY_CATEGORIES = ["All", "Hair", "Nails", "Makeup", "Henna"] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export type GalleryImage = {
  id: string;
  category: Exclude<GalleryCategory, "All">;
  src: string;
  alt: string;
};

// Real portfolio images from PY Luxe albums + generated brand imagery
export const GALLERY: GalleryImage[] = [

  // Nails (real photos - placed at the top for maximum visibility)
  { id: "gal-nails-1", category: "Nails", src: "/images/nails/nails-1.jpeg", alt: "Nail Art 1" },
  { id: "gal-nails-2", category: "Nails", src: "/images/nails/nails-2.jpeg", alt: "Nail Art 2" },
  { id: "gal-nails-3", category: "Nails", src: "/images/nails/nails-3.jpeg", alt: "Nail Art 3" },
  { id: "gal-nails-4", category: "Nails", src: "/images/nails/nails-4.jpeg", alt: "Nail Art 4" },
  { id: "gal-nails-5", category: "Nails", src: "/images/nails/nails-5.jpeg", alt: "Nail Art 5" },
  { id: "gal-nails-6", category: "Nails", src: "/images/nails/nails-6.jpeg", alt: "Nail Art 6" },
  { id: "gal-nails-7", category: "Nails", src: "/images/nails/nails-7.jpeg", alt: "Nail Art 7" },
  { id: "gal-nails-8", category: "Nails", src: "/images/nails/nails-8.jpeg", alt: "Nail Art 8" },
  { id: "gal-nails-9", category: "Nails", src: "/images/nails/nails-9.jpeg", alt: "Nail Art 9" },
  { id: "gal-nails-10", category: "Nails", src: "/images/nails/nails-10.jpeg", alt: "Nail Art 10" },
  { id: "gal-nails-11", category: "Nails", src: "/images/nails/nails-11.jpeg", alt: "Nail Art 11" },
  { id: "gal-nails-12", category: "Nails", src: "/images/nails/nails-12.jpeg", alt: "Nail Art 12" },
  { id: "gal-nails-13", category: "Nails", src: "/images/nails/nails-13.jpeg", alt: "Nail Art 13" },
  { id: "gal-nails-14", category: "Nails", src: "/images/nails/nails-14.jpeg", alt: "Nail Art 14" },
  { id: "gal-nails-15", category: "Nails", src: "/images/nails/nails-15.jpeg", alt: "Nail Art 15" },
  { id: "gal-nails-16", category: "Nails", src: "/images/nails/nails-16.jpeg", alt: "Nail Art 16" },
  { id: "gal-nails-17", category: "Nails", src: "/images/nails/nails-17.jpeg", alt: "Nail Art 17" },
  { id: "gal-nails-18", category: "Nails", src: "/images/nails/nails-18.jpeg", alt: "Nail Art 18" },
  { id: "gal-nails-19", category: "Nails", src: "/images/nails/nails-19.jpeg", alt: "Nail Art 19" },
  { id: "gal-nails-20", category: "Nails", src: "/images/nails/nails-20.jpeg", alt: "Nail Art 20" },
  { id: "gal-nails-21", category: "Nails", src: "/images/nails/nails-21.jpeg", alt: "Nail Art 21" },
  { id: "gal-nails-22", category: "Nails", src: "/images/nails/nails-22.jpeg", alt: "Nail Art 22" },
  { id: "gal-nails-23", category: "Nails", src: "/images/nails/nails-23.jpeg", alt: "Nail Art 23" },
  { id: "gal-nails-24", category: "Nails", src: "/images/nails/nails-24.jpeg", alt: "Nail Art 24" },
  { id: "gal-nails-25", category: "Nails", src: "/images/nails/nails-25.jpeg", alt: "Nail Art 25" },
  { id: "gal-nails-26", category: "Nails", src: "/images/nails/nails-26.jpeg", alt: "Nail Art 26" },
  { id: "gal-nails-27", category: "Nails", src: "/images/nails/nails-27.jpeg", alt: "Nail Art 27" },
  { id: "gal-nails-28", category: "Nails", src: "/images/nails/nails-28.jpeg", alt: "Nail Art 28" },
  { id: "gal-nails-29", category: "Nails", src: "/images/nails/nails-29.jpeg", alt: "Nail Art 29" },
  { id: "gal-nails-30", category: "Nails", src: "/images/nails/nails-30.jpeg", alt: "Nail Art 30" },
  { id: "gal-nails-31", category: "Nails", src: "/images/nails/nails-31.jpeg", alt: "Nail Art 31" },
  { id: "gal-nails-32", category: "Nails", src: "/images/nails/nails-32.jpeg", alt: "Nail Art 32" },
  { id: "gal-nails-33", category: "Nails", src: "/images/nails/nails-33.jpeg", alt: "Nail Art 33" },
  { id: "gal-nails-34", category: "Nails", src: "/images/nails/nails-34.jpeg", alt: "Nail Art 34" },

  // Hair
  { id: "gal-hair-1", category: "Hair", src: "/images/hair.png", alt: "Elegant Hair Styling" },

  // Makeup & Eyebrows
  { id: "gal-makeup-1", category: "Makeup", src: "/images/makeup.png", alt: "Flawless Soft Glam Makeup" },
  { id: "gal-eyebrows-1", category: "Makeup", src: "/images/eyebrows.png", alt: "Expertly Carved & Shaped Eyebrows" },
  { id: "gal-nails-new-1", category: "Nails", src: "/images/nails/new_nails_1.png", alt: "Elegant Nail Art 1" },
  { id: "gal-nails-new-2", category: "Nails", src: "/images/nails/new_nails_2.png", alt: "Elegant Nail Art 2" },
  { id: "gal-makeup-4", category: "Makeup", src: "/images/makeup/brows-3.jpeg", alt: "Makeup & Eyebrow Styling 3" },
  { id: "gal-makeup-5", category: "Makeup", src: "/images/makeup/brows-4.jpeg", alt: "Makeup & Eyebrow Styling 4" },
  { id: "gal-makeup-6", category: "Makeup", src: "/images/makeup/brows-5.jpeg", alt: "Makeup & Eyebrow Styling 5" },

  // Henna
  { id: "gal-henna-1", category: "Henna", src: "/images/henna/henna-1.jpeg", alt: "Henna Design 1" },
  { id: "gal-henna-2", category: "Henna", src: "/images/henna/henna-2.jpeg", alt: "Henna Design 2" },
  { id: "gal-henna-3", category: "Henna", src: "/images/henna/henna-3.jpeg", alt: "Henna Design 3" },
  { id: "gal-henna-4", category: "Henna", src: "/images/henna/henna-4.jpeg", alt: "Henna Design 4" },
  { id: "gal-henna-5", category: "Henna", src: "/images/henna/henna-5.jpeg", alt: "Henna Design 5" },
  { id: "gal-henna-6", category: "Henna", src: "/images/henna/henna-6.jpeg", alt: "Henna Design 6" },
  { id: "gal-henna-7", category: "Henna", src: "/images/henna/henna-7.jpeg", alt: "Henna Design 7" },
  { id: "gal-henna-8", category: "Henna", src: "/images/henna/henna-8.jpeg", alt: "Henna Design 8" },
];

export const FAQS = [
  {
    q: "Where are you located?",
    a: "PY Luxe is based in Abuja and is available at Veritas University.",
  },
  {
    q: "Do you offer home service?",
    a: "Yes, home service is available.",
  },
  {
    q: "How do I book?",
    a: "Choose your service, fill in the booking form and continue to WhatsApp.",
  },
  {
    q: "Is there a deposit?",
    a: "Yes. A ₦1,000 deposit is required to secure your appointment.",
  },
  {
    q: "How do I confirm my deposit?",
    a: "After making your deposit, send your payment screenshot to PY Luxe on WhatsApp for verification.",
  },
];

export const BOOKING_DEPOSIT = "₦1,000";
