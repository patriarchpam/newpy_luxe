import Image from "next/image";
import Link from "next/link";
import { Check, MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { whatsappLink } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = {
  title: "About Us | PY Luxe — Hair, Nails, Makeup & Henna in Abuja",
  description: "Learn about PY Luxe, offering hair, nail, makeup and henna services in Abuja.",
};

export default function AboutPage() {
  const whyPyLuxe = [
    "Personalized beauty service",
    "Attention to detail",
    "Convenient booking",
    `Available at ${BRAND.primary_service_location}`,
    "Home service available",
  ];

  return (
    <main>
      <section className="bg-noir px-5 py-14 text-center sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <SectionHeading
            eyebrow="About PY Luxe"
            title="Beauty, style & confidence"
            subtitle={BRAND.description}
            light
          />
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-[2rem] shadow-soft ring-1 ring-black/5 relative h-[360px] sm:h-[480px] w-full">
            <Image
              src="/images/hero.png"
              alt="PY Luxe beauty environment"
              fill
              className="object-cover"
            />
          </div>

          <div>
            <SectionHeading eyebrow="Our Story" title="Tailored beauty services for you" align="left" />
            <p className="mt-6 text-[16px] leading-relaxed text-ash">
              PY Luxe is a beauty brand based in Abuja, offering hair, nail, makeup and henna services with a focus on helping every client look and feel their absolute best.
            </p>

            <ul className="mt-8 space-y-4">
              {whyPyLuxe.map((point) => (
                <li key={point} className="flex items-center gap-3 text-[15px] text-ink">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-plum-500 text-white">
                    <Check size={14} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
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
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-ink/20 px-8 text-[12px] uppercase tracking-[0.2em] text-ink hover:border-plum-500 hover:text-plum-600"
              >
                <MessageCircle size={16} /> Enquire on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
