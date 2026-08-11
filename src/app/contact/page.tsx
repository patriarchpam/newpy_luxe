import Link from "next/link";
import { MessageCircle, MapPin, Phone } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { whatsappLink } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = {
  title: "Contact Us | PY Luxe — Hair, Nails, Makeup & Henna in Abuja",
  description: "Get in touch with PY Luxe on WhatsApp or book an appointment in Abuja.",
};

export default function ContactPage() {
  const generalEnquiry = "Hello PY Luxe! 💕 I'd like to make an enquiry.";

  return (
    <main>
      <section className="bg-noir px-5 py-14 text-center sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <SectionHeading
            eyebrow="Contact"
            title="Get in touch with PY Luxe"
            subtitle="Message us directly on WhatsApp to ask a question, check availability, or discuss a custom design."
            light
          />
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-black/5 bg-cloud p-8 sm:p-12 shadow-soft text-center">
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">
            PY <span className="text-plum-600">Luxe</span>
          </h2>
          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-plum-600 font-medium">
            {BRAND.tagline}
          </p>

          <div className="mt-8 space-y-4 text-[15px] text-ash">
            <p className="flex items-center justify-center gap-2">
              <MapPin size={18} className="text-plum-600 shrink-0" />
              <span>
                {BRAND.location} • Available at {BRAND.primary_service_location}
              </span>
            </p>
            <p className="flex items-center justify-center gap-2">
              <Phone size={18} className="text-plum-600 shrink-0" />
              <span>WhatsApp: {BRAND.display_whatsapp}</span>
            </p>
          </div>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href={whatsappLink(BRAND.whatsapp, generalEnquiry)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-plum-500 px-8 text-[12px] uppercase tracking-[0.2em] text-white hover:bg-plum-400 font-semibold"
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
            <Link
              href="/booking"
              className="inline-flex h-14 items-center justify-center rounded-full border border-ink/20 px-8 text-[12px] uppercase tracking-[0.2em] text-ink hover:border-plum-500 hover:text-plum-600 font-medium"
            >
              Book an appointment
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
