import Link from "next/link";
import { Calendar, LayoutDashboard, Settings, Scissors, Users } from "lucide-react";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Calendar", href: "/admin/calendar", icon: Calendar },
    { name: "Bookings", href: "/admin/bookings", icon: Users },
    { name: "Services", href: "/admin/services", icon: Scissors },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-cloud flex flex-col md:flex-row pb-16 md:pb-0">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-black/5 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-black/5">
          <Link href="/" className="font-serif text-2xl tracking-wide">
            PY LUXE <span className="text-xs uppercase font-sans text-plum-500 tracking-widest block mt-1">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-ash hover:text-plum-600 hover:bg-plum-50 transition-colors"
            >
              <link.icon size={18} />
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-black/10 flex justify-around items-center p-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="flex flex-col items-center gap-1 p-2 text-ash hover:text-plum-600 transition-colors"
          >
            <link.icon size={20} />
            <span className="text-[10px] font-medium">{link.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
