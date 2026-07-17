import { Link } from "@tanstack/react-router";
import { HelpCircle, Menu, X, MessageCircle } from "lucide-react";
import { useState } from "react";
import { img } from "@/lib/assets";
import { waLink, WHATSAPP_DISPLAY } from "@/lib/whatsapp";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/ticket", label: "Print Ticket" },
  { to: "/contact", label: "Contact Us" },
  { to: "/gallery", label: "Gallery" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={img.logo} alt="BusCar logo" className="h-10 w-auto" />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-lg font-extrabold tracking-wide text-[#c8102e]">BUSCAR</span>
            <span className="text-[10px] font-semibold text-amber-500 tracking-widest">
              EAGLE ABOVE THE REST
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="text-sm font-medium text-slate-800 hover:text-[#c8102e] transition-colors"
              activeProps={{ className: "text-[#c8102e]" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <img src={img.uk} alt="English" className="h-5 w-7 rounded-sm object-cover" />
          <Link
            to="/support"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-800 hover:text-[#c8102e]"
          >
            <HelpCircle className="h-4 w-4" /> Support
          </Link>
          <a
            href={waLink("Hi BusCar, I'd like to book a ticket.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <MessageCircle className="h-4 w-4" /> Book: {WHATSAPP_DISPLAY}
          </a>
        </div>

        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-3 flex flex-col gap-2">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium text-slate-800"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/support"
              onClick={() => setOpen(false)}
              className="py-2 text-sm font-medium text-slate-800"
            >
              Support
            </Link>
            <button className="mt-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">
              My Account
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
