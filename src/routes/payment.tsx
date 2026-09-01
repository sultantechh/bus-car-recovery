import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Copy, Check, Wallet } from "lucide-react";
import { useState } from "react";
import { SiteLayout } from "@/components/site/Layout";
import { LIPA_NA_POCHI_DISPLAY, WHATSAPP_DISPLAY, waLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/payment")({
  head: () => ({
    meta: [
      { title: "Payment — BusCar | Lipa na Pochi" },
      { name: "description", content: "Pay for your BusCar ticket via Lipa na Pochi M-Pesa." },
      { property: "og:title", content: "Pay for your BusCar ticket" },
      { property: "og:description", content: "Lipa na Pochi payment instructions for BusCar bookings." },
    ],
  }),
  component: Payment,
});

function Payment() {
  const [copied, setCopied] = useState(false);

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(LIPA_NA_POCHI_DISPLAY);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
        <div className="rounded-2xl bg-slate-50 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-100 p-2.5">
              <Wallet className="h-6 w-6 text-emerald-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Payment</h1>
              <p className="text-sm text-slate-600">
                Complete your booking via Lipa na Pochi
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-white p-5 border border-slate-200">
            <h2 className="font-semibold text-slate-900">Lipa na Pochi number</h2>
            <p className="mt-1 text-sm text-slate-600">
              Send your ticket payment to this M-Pesa number:
            </p>
            <div className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-emerald-50 px-4 py-3">
              <span className="text-2xl sm:text-3xl font-bold text-emerald-700">
                {LIPA_NA_POCHI_DISPLAY}
              </span>
              <button
                type="button"
                onClick={copyNumber}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-300 transition"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <ol className="mt-6 space-y-3 text-sm text-slate-700 list-decimal list-inside">
            <li>Open the M-Pesa menu on your phone.</li>
            <li>Select <strong>Lipa na M-Pesa</strong>.</li>
            <li>Choose <strong>Lipa na Pochi</strong>.</li>
            <li>Enter phone number <strong>{LIPA_NA_POCHI_DISPLAY}</strong>.</li>
            <li>Enter the amount shown on your booking.</li>
            <li>Enter your M-Pesa PIN and confirm.</li>
            <li>Share the confirmation message on WhatsApp {WHATSAPP_DISPLAY}.</li>
          </ol>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href={waLink("Hi BusCar, I have made a Lipa na Pochi payment and would like to confirm my booking.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <MessageCircle className="h-4 w-4" /> Confirm on WhatsApp
            </a>
            <Link
              to="/ticket"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-slate-900"
            >
              Print Ticket
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
