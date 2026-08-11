"use client";

import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { BRAND, NAV_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-noir px-5 pb-28 pt-16 text-mist sm:px-8 sm:pb-16" aria-label="Site footer">
      <div className="mx-auto grid w-full max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-serif text-3xl text-white">
            PY <span className="text-plum-300">Luxe</span>
          </p>
          <p className="mt-2 text-sm tracking-[0.2em] uppercase text-plum-200">{BRAND.tagline}</p>
          <p className="mt-4 text-sm text-ash">Hair • Nails • Makeup • Henna</p>
        </div>

        <div className="space-y-3 text-sm">
          <p className="flex items-start gap-2">
            <MapPin size={16} className="mt-0.5 shrink-0 text-plum-300" />
            <span>
              {BRAND.location}
              <br />
              Available at {BRAND.primary_service_location}
              <br />
              Home service available
            </span>
          </p>
          <p className="flex items-center gap-2">
            <Phone size={16} className="shrink-0 text-plum-300" />
            WhatsApp: {BRAND.display_whatsapp}
          </p>
        </div>

        <nav aria-label="Footer navigation" className="text-sm">
          <ul className="grid grid-cols-2 gap-y-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/booking" className="hover:text-white transition-colors">
                Booking
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-12 w-full max-w-6xl border-t border-white/10 pt-6 text-xs text-ash">
        © 2026 {BRAND.name}. All rights reserved.
      </div>
    </footer>
  );
}
