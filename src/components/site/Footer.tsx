import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Linkedin, Instagram, Mail, MessageCircle, Phone } from "lucide-react";
import { img } from "@/lib/assets";
import { waLink, WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-300 mt-16">
      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-10 md:grid-cols-4 items-center">
        <div className="flex items-center gap-3">
          <img src={img.logo} alt="BusCar" className="h-10 w-auto" />
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-extrabold text-[#c8102e]">BUSCAR</span>
            <span className="text-[10px] font-semibold text-amber-500 tracking-widest">
              EAGLE ABOVE THE REST
            </span>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex items-center gap-1 text-2xl font-extrabold text-rose-500">
            <span className="text-3xl">🧳</span>
            <span>ravler</span>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-2xl font-extrabold text-sky-500">
            <span className="text-3xl">≡</span>
            <span>VOLTIC</span>
          </div>
        </div>
        <div className="flex items-center justify-center md:justify-end gap-3">
          <a
            href={waLink("Hi BusCar, I'd like to book a ticket.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp {WHATSAPP_DISPLAY}
          </a>
          <a
            href={`tel:${WHATSAPP_NUMBER}`}
            className="inline-flex items-center gap-2 rounded-md bg-neutral-800 px-3 py-2 text-xs font-medium hover:bg-neutral-700"
          >
            <Phone className="h-4 w-4" /> Call
          </a>
        </div>
      </div>
      <div className="border-t border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Mail className="h-5 w-5 text-neutral-500" />
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link to="/about" className="hover:text-white">About</Link>
            <Link to="/ticket" className="hover:text-white">Print Ticket</Link>
            <Link to="/contact" className="hover:text-white">Get In Touch</Link>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Privacy Policy</a>
          </nav>
          <div className="flex items-center gap-4 text-neutral-400">
            <a href="#" aria-label="Facebook"><Facebook className="h-4 w-4 hover:text-white" /></a>
            <a href="#" aria-label="Twitter"><Twitter className="h-4 w-4 hover:text-white" /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin className="h-4 w-4 hover:text-white" /></a>
            <a href="#" aria-label="Instagram"><Instagram className="h-4 w-4 hover:text-white" /></a>
          </div>
        </div>
        <div className="text-center text-xs text-neutral-500 pb-6">
          BusCar © {new Date().getFullYear()} - All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
