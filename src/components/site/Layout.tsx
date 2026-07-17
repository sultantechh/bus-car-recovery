import type { ReactNode } from "react";
import { MessageCircle } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { waLink, WHATSAPP_DISPLAY } from "@/lib/whatsapp";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <a
        href={waLink("Hi BusCar, I'd like to book a ticket.")}
        target="_blank"
        rel="noreferrer"
        aria-label={`Book on WhatsApp ${WHATSAPP_DISPLAY}`}
        className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 active:scale-95 transition"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="hidden sm:inline">Book on WhatsApp</span>
        <span className="sm:hidden">Book now</span>
      </a>
    </div>
  );
}
