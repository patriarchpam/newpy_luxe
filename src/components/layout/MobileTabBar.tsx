"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Image as ImageIcon, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/services", label: "Services", Icon: Sparkles },
  { href: "/gallery", label: "Gallery", Icon: ImageIcon },
  { href: "/booking", label: "Book", Icon: CalendarCheck },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-noir/95 backdrop-blur md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch">
        {tabs.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-[10px] uppercase tracking-[0.14em] transition-colors",
                  isActive ? "text-plum-300" : "text-mist"
                )}
              >
                <Icon size={19} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
