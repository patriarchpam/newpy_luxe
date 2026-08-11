"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { BRAND, GALLERY } from "@/lib/constants";
import { whatsappLink } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { GalleryClient } from "@/app/gallery/GalleryClient";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  const serviceCategories = [
    { id: "hair", name: "Hair", blurb: "Hair styling and related hair services.", image: "/images/hair.png" },
    { id: "nails", name: "Nails", blurb: "Nail services and nail art.", image: "/images/nails.png" },
    { id: "makeup", name: "Makeup", blurb: "Makeup and glam services.", image: "/images/makeup.png" },
    { id: "henna", name: "Henna", blurb: "Henna artistry and designs.", image: "/images/henna.png" },
  ];

  const whyPyLuxe = [
    "Personalized beauty service",
    "Attention to detail",
    "Convenient booking",
    `Available at ${BRAND.primary_service_location}`,
    "Home service available",
  ];

  const generalEnquiry = "Hello PY Luxe! 💕 I'd like to make an enquiry.";

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-noir">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pb-14 pt-14 sm:px-8 lg:grid-cols-2 lg:gap-14 lg:pb-24 lg:pt-20">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.p variants={fadeInUp} className="text-[11px] uppercase tracking-luxe text-plum-300">{BRAND.location}</motion.p>
            <motion.h1 variants={fadeInUp} className="mt-4 font-serif text-6xl leading-[0.95] text-white sm:text-7xl lg:text-[86px]">
              PY <span className="italic text-plum-300">Luxe</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="mt-4 text-sm uppercase tracking-[0.3em] text-mist">{BRAND.tagline}</motion.p>
            <motion.p variants={fadeInUp} className="mt-6 max-w-md text-[17px] leading-relaxed text-mist">{BRAND.description}</motion.p>

            <motion.p variants={fadeInUp} className="mt-6 inline-flex flex-wrap items-center gap-x-2 rounded-full border border-white/15 px-4 py-2 text-[12px] text-cloud">
              Available at {BRAND.primary_service_location} <span className="text-plum-300">•</span> Home service available
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/booking"
                className="inline-flex h-14 items-center justify-center rounded-full bg-plum-500 px-8 text-[12px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-plum-400 font-semibold"
              >
                Book an appointment
              </Link>
              <Link
                href="/services"
                className="inline-flex h-14 items-center justify-center rounded-full border border-white/25 px-8 text-[12px] uppercase tracking-[0.2em] text-white transition-colors hover:border-plum-300 hover:text-plum-200"
              >
                View services
              </Link>
            </motion.div>

            <motion.a
              variants={fadeInUp}
              href={whatsappLink(BRAND.whatsapp, generalEnquiry)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.18em] text-plum-200 hover:text-white"
            >
              <MessageCircle size={16} /> Chat with PY Luxe on WhatsApp
            </motion.a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-[2rem] shadow-soft ring-1 ring-white/10 relative h-[420px] sm:h-[560px] w-full">
              <Image
                src="/images/hero.png"
                alt="PY Luxe beauty look — braided hair, soft glam makeup and manicured nails"
                fill
                className="object-cover"
                priority
              />
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="pointer-events-none absolute -bottom-4 -left-4 hidden rounded-2xl bg-plum-500 px-6 py-4 text-white sm:block"
            >
              <p className="font-serif text-xl leading-none">Hair • Nails</p>
              <p className="font-serif text-xl leading-none">Makeup • Henna</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto w-full max-w-6xl">
          <SectionHeading
            eyebrow="What we do"
            title="Four ways to feel your best"
            subtitle="Explore the PY Luxe beauty services and book the one you need."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCategories.map((cat) => (
              <div key={cat.id}>
                <Link
                  href={`/services#${cat.id}`}
                  className="group block overflow-hidden rounded-3xl border border-black/5 bg-white shadow-soft"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-cloud relative">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-2xl text-ink">{cat.name}</h3>
                    <p className="mt-1.5 text-sm text-ash">{cat.blurb}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-plum-600">
                      View <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY PY LUXE */}
      <section className="bg-plum-900 px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-[2rem] ring-1 ring-white/10 relative h-[320px] sm:h-[440px] w-full">
            <Image
              src="/images/makeup.png"
              alt="Soft glam makeup by PY Luxe"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading eyebrow="Why PY Luxe" title="Beauty, done with care" align="left" light />
            <ul className="mt-8 space-y-4">
              {whyPyLuxe.map((point) => (
                <li key={point} className="flex items-center gap-3 text-[15px] text-cloud">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-plum-500 text-white">
                    <Check size={14} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto w-full max-w-6xl">
          <SectionHeading
            eyebrow="Featured work"
            title="A look at the PY Luxe style"
            subtitle="Explore our real portfolio of nail art and henna designs."
          />
          <div className="mt-12">
            <GalleryClient itemsLimit={9} />
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/gallery"
              className="inline-flex h-13 items-center justify-center rounded-full border border-ink/20 px-8 py-4 text-[12px] uppercase tracking-[0.2em] text-ink transition-colors hover:border-plum-500 hover:text-plum-600"
            >
              View full gallery
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cloud px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto w-full max-w-6xl">
          <SectionHeading eyebrow="FAQ" title="Good to know" />
          <div className="mt-10">
            <FaqAccordion />
          </div>
        </div>
      </section>

      {/* READY TO BOOK */}
      <section className="bg-noir px-5 py-20 text-center sm:px-8 sm:py-28">
        <div className="mx-auto w-full max-w-2xl">
          <SectionHeading
            eyebrow="Ready to book?"
            title="Let's get you booked in"
            subtitle="A ₦1,000 deposit secures your appointment. Send your booking request and PY Luxe will take it from there on WhatsApp."
            light
          />
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/booking"
              className="inline-flex h-14 items-center justify-center rounded-full bg-plum-500 px-8 text-[12px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-plum-400 font-semibold"
            >
              Book an appointment
            </Link>
            <a
              href={whatsappLink(BRAND.whatsapp, generalEnquiry)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/25 px-8 text-[12px] uppercase tracking-[0.2em] text-white transition-colors hover:border-plum-300 hover:text-plum-200"
            >
              <MessageCircle size={16} /> Chat with PY Luxe
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
