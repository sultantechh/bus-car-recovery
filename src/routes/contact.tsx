import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { waLink, WHATSAPP_DISPLAY } from "@/lib/whatsapp";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact BusCar — Get In Touch" },
      { name: "description", content: "Reach the BusCar team by phone, email or contact form. Office numbers across Kenya." },
      { property: "og:title", content: "Contact BusCar" },
      { property: "og:description", content: "Head office and branch contact details." },
    ],
  }),
  component: Contact,
});

const HEAD = [
  ["0718127350", "0785700700"],
  ["0717073333/0731333888", "0709 832 302"],
];

const OFFICES: [string, string][] = [
  ["MWEMBE TAYARI OFFICE 1", "0702555005"],
  ["MWEMBE TAYARI OFFICE 2", "0717073333"],
  ["COURIER MOMBASA", "0798222002"],
  ["BONDENI OFFICE", "0114500555"],
  ["CHANGAMWE OFFICE", "0793666006"],
  ["MARIAKANI OFFICE", "0759000101"],
  ["NYALI OFFICE", "0752000555"],
  ["BAMBURI OFFICE", "0790616151"],
  ["MAJAONI OFFICE", "0112500555"],
  ["MTWAPA OFFICE", "0792100100"],
  ["KILIFI OFFICE", "0717072020"],
  ["TIMBONI OFFICE", "0711505500"],
  ["MALINDI OFFICE", "0711500888"],
  ["MACHAKOS JUNCTION OFFICE", "0711515115"],
  ["MLOLONGO OFFICE", "0777222222"],
  ["NAIROBI OFFICE TOWN", "0718127350"],
  ["NAIROBI OFFICE PARCEL", "0790505050"],
  ["SOUTH C OFFICE", "0711502626"],
  ["EASTLEIGH OFFICE", "0790606060"],
  ["PRESTIGE OFFICE", "0741555005"],
  ["THIKA OFFICE", "0750010101"],
  ["MAKONGENI OFFICE", "0703305555"],
  ["NAKURU OFFICE", "0717027770"],
  ["GILGIL OFFICE", "0741555666"],
  ["KISUMU OFFICE", "0722582333"],
  ["ELDORET OFFICE", "0718252296"],
  ["MINJILA OFFICE", "0743110001"],
  ["KIBAONI OFFICE", "0790110001"],
  ["MPEKETONI OFFICE", "0737666333"],
  ["WITU OFFICE", "0795220002"],
  ["HINDI OFFICE", "0114110001"],
  ["MOKOWE OFFICE", "0740220002"],
  ["LAMU OFFICE", "0740552525"],
];

function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    first: "",
    last: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
  });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text =
      `Hi BusCar,\n\nName: ${form.first} ${form.last}\nEmail: ${form.email}\nMobile: ${form.mobile}\n` +
      `Subject: ${form.subject}\n\n${form.message}`;
    window.open(waLink(text), "_blank");
    setSent(true);
  };
  return (
    <SiteLayout>
      {/* Banner */}
      <section className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Travel Smarter &<br />save more
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-neutral-300">
            Discover smarter routes, unbeatable deals, and a seamless booking experience —
            all in one place. Travel better, for less.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl font-bold text-center">Get In Touch</h2>
        <div className="mt-10 grid md:grid-cols-2 gap-8 rounded-2xl bg-slate-50 p-6 md:p-10">
          <div>
            <h3 className="font-semibold">Contact Details</h3>
            <div className="mt-4 border-t border-slate-200 pt-4">
              <p className="font-semibold text-sm">Head Office:</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                {HEAD.flat().map((p) => (
                  <a
                    key={p}
                    href={`tel:${p.replace(/\D/g, "")}`}
                    className="text-slate-700 hover:text-[#c8102e]"
                  >
                    {p}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="grid gap-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" placeholder="Enter first name" required />
              <Input label="Last Name" placeholder="Enter last name" required />
              <Input label="Email Address" type="email" placeholder="Enter email address" required />
              <Input label="Mobile Number" placeholder="Enter mobile number" required />
            </div>
            <Input label="Subject" placeholder="Enter subject of enquiry / your message" />
            <div>
              <label className="text-xs font-medium text-slate-600">Message</label>
              <textarea
                rows={4}
                placeholder="Your message"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
              />
            </div>
            <button className="justify-self-start rounded-full bg-slate-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-900">
              Send Message
            </button>
            {sent && <p className="text-sm text-emerald-600">Message sent — we'll get back to you shortly.</p>}
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl font-bold">Office numbers</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {OFFICES.map(([name, phone]) => (
            <div
              key={name}
              className="rounded-xl border border-slate-200 p-4 flex items-center justify-between hover:border-slate-400"
            >
              <span className="text-sm font-semibold">{name}</span>
              <a
                href={`tel:${phone.replace(/\D/g, "")}`}
                className="text-sm text-[#c8102e] font-medium"
              >
                {phone}
              </a>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

function Input({
  label,
  ...rest
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-600">{label}</label>
      <input
        {...rest}
        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
      />
    </div>
  );
}
