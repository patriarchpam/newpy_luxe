import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Clock } from "lucide-react";
import { SERVICES, ServiceCategory, BRAND } from "@/lib/constants";
import { whatsappLink } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = {
  title: "Services",
  description: "Browse PY Luxe hair, nail, makeup and henna services in Abuja. Available at Veritas University with home service available.",
};

export default function ServicesPage() {
  const categories: { id: ServiceCategory; name: string; blurb: string }[] = [
    { id: "Hair", name: "Hair", blurb: "Hair styling and related hair services." },
    { id: "Nails", name: "Nails", blurb: "Nail services and nail art." },
    { id: "Makeup", name: "Makeup", blurb: "Makeup and glam services." },
    { id: "Henna", name: "Henna", blurb: "Henna artistry and designs." },
  ];

  const serviceEnquiry = (serviceName: string) =>
    `Hello PY Luxe! 💕 I'd like to enquire about ${serviceName}.`;

  return (
    <main>
      <section className="bg-noir px-5 py-14 text-center sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <SectionHeading
            eyebrow="Services"
            title="Hair, nails, makeup & henna"
            subtitle='Prices shown where available. Where a price depends on the style, length or detail, it is shown as "Price available on request" — just ask on WhatsApp.'
            light
          />
        </div>
      </section>

      {categories.map((cat, idx) => {
        const categoryServices = SERVICES.filter((s) => s.category === cat.id);
        if (categoryServices.length === 0) return null;

        return (
          <section
            key={cat.id}
            id={cat.id.toLowerCase()}
            className={`scroll-mt-24 px-5 py-16 sm:px-8 sm:py-20 ${
              idx % 2 === 0 ? "bg-white" : "bg-cloud"
            }`}
          >
            <div className="mx-auto w-full max-w-6xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <SectionHeading
                  eyebrow={`0${idx + 1}`}
                  title={cat.name}
                  subtitle={cat.blurb}
                  align="left"
                />
                <a
                  href={whatsappLink(BRAND.whatsapp, serviceEnquiry(cat.name))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-ink/20 px-6 text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:border-plum-500 hover:text-plum-600 font-medium"
                >
                  <MessageCircle size={15} /> Enquire about {cat.name}
                </a>
              </div>

              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {categoryServices.map((service) => (
                  <article
                    key={service.id}
                    className="group flex flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-soft"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-cloud relative">
                      {service.image && (
                        <Image
                          src={service.image}
                          alt={service.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-serif text-2xl text-ink">{service.name}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-ash">
                        {service.description}
                      </p>

                      <p className="mt-4 text-[15px] font-medium text-plum-600">
                        {service.price}
                      </p>

                      {service.duration && (
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-ash">
                          <Clock size={13} /> {service.duration}
                        </p>
                      )}

                      <Link
                        href={`/booking?service=${encodeURIComponent(service.name)}`}
                        className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-[12px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-plum-600 font-medium"
                      >
                        Book {service.name}
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="bg-plum-900 px-5 py-16 text-center sm:px-8 sm:py-20">
        <div className="mx-auto max-w-xl">
          <SectionHeading
            title="Not sure which service you need?"
            subtitle="Send a message and PY Luxe will help you decide. A ₦1,000 deposit secures your appointment."
            light
          />
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/booking"
              className="inline-flex h-14 items-center justify-center rounded-full bg-plum-500 px-8 text-[12px] uppercase tracking-[0.2em] text-white hover:bg-plum-400 font-semibold"
            >
              Book an appointment
            </Link>
            <a
              href={whatsappLink(BRAND.whatsapp, "Hello PY Luxe! 💕 I'd like to make an enquiry.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/25 px-8 text-[12px] uppercase tracking-[0.2em] text-white hover:border-plum-300"
            >
              <MessageCircle size={16} /> Enquire now
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
