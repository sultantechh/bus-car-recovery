import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { SiteLayout } from "@/components/site/Layout";
import { waLink, WHATSAPP_DISPLAY } from "@/lib/whatsapp";

export const Route = createFileRoute("/ticket")({
  head: () => ({
    meta: [
      { title: "Print Ticket — BusCar" },
      { name: "description", content: "Retrieve your BusCar ticket by chatting with us on WhatsApp." },
      { property: "og:title", content: "Print your BusCar Ticket" },
      { property: "og:description", content: "Look up and print your booked ticket." },
    ],
  }),
  component: Ticket,
});

function Ticket() {
  const [num, setNum] = useState("");
  const [phone, setPhone] = useState("");

  const message =
    `Hi BusCar, please help me print / resend my ticket.\n\n` +
    `Ticket number: ${num || "(not provided)"}\n` +
    `Mobile number: ${phone || "(not provided)"}`;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
        <div className="rounded-2xl bg-slate-50 p-6 sm:p-8 shadow-sm">
          <h1 className="text-xl font-bold">Print Ticket</h1>
          <p className="mt-1 text-sm text-slate-500">
            Enter your details and we'll send your ticket on WhatsApp {WHATSAPP_DISPLAY}.
          </p>
          <form
            className="mt-6 grid md:grid-cols-2 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              window.open(waLink(message), "_blank");
            }}
          >
            <div>
              <label className="text-sm font-medium">Ticket Number</label>
              <input
                value={num}
                onChange={(e) => setNum(e.target.value)}
                required
                placeholder="e.g XYZ123456789"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Mobile Number</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="e.g 0785700700"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 w-full sm:w-auto justify-center">
                <MessageCircle className="h-4 w-4" /> Send on WhatsApp
              </button>
            </div>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}

