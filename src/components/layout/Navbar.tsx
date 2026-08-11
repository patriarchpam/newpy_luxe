"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-noir/95 backdrop-blur">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:h-20 sm:px-8"
      >
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="font-serif text-2xl tracking-wide text-white sm:text-[28px]"
        >
          PY <span className="text-plum-300">Luxe</span>
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-[13px] uppercase tracking-[0.18em] transition-colors",
                    isActive ? "text-plum-300" : "text-mist hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href="/booking"
              className="rounded-full bg-plum-500 px-6 py-2.5 text-[12px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-plum-400"
            >
              Book
            </Link>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-white md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-white/10 bg-noir md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-5 py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block py-3.5 text-sm uppercase tracking-[0.18em]",
                    pathname === link.href ? "text-plum-300" : "text-mist"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="py-3">
              <Link
                href="/booking"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-plum-500 px-6 py-3.5 text-center text-[12px] uppercase tracking-[0.18em] text-white"
              >
                Book an appointment
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
