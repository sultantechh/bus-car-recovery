import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { SiteLayout } from "@/components/site/Layout";

export const Route = createFileRoute("/ticket")({
  head: () => ({
    meta: [
      { title: "Print Ticket — BusCar" },
      { name: "description", content: "Print your BusCar ticket by entering your ticket number and mobile." },
      { property: "og:title", content: "Print your BusCar Ticket" },
      { property: "og:description", content: "Look up and print your booked ticket." },
    ],
  }),
  component: Ticket,
});

function Ticket() {
  const [num, setNum] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-2xl bg-slate-50 p-8 shadow-sm">
          <h1 className="text-xl font-bold">Print Ticket</h1>
          <form
            className="mt-6 grid md:grid-cols-2 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setMsg("No ticket found for the details provided.");
            }}
          >
            <div>
              <label className="text-sm font-medium">Ticket Number</label>
              <input
                value={num}
                onChange={(e) => setNum(e.target.value)}
                required
                placeholder="e.g XYZ123456789"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Mobile Number</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="e.g 0785700700"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
                <Search className="h-4 w-4" /> Print Ticket
              </button>
            </div>
            {msg && (
              <p className="md:col-span-2 text-sm text-rose-600">{msg}</p>
            )}
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
