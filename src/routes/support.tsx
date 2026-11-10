import { createFileRoute } from "@tanstack/react-router";
import { Phone, MessageCircle, Mail, Clock } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { img } from "@/lib/assets";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Customer Support — BusCar" },
      { name: "description", content: "24/7 BusCar customer support. Call, WhatsApp or email us any time." },
      { property: "og:title", content: "BusCar Customer Support" },
      { property: "og:description", content: "We're available around the clock." },
    ],
  }),
  component: Support,
});

const HEAD = ["0103177255"];

function Support() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-12 text-center">
        <img
          src={img.support}
          alt="Customer Support"
          className="mx-auto h-56 md:h-72 w-auto"
        />
        <h1 className="mt-8 text-3xl md:text-4xl font-extrabold text-slate-900">
          BusCar Customer Support
        </h1>
        <p className="mt-2 text-sm text-slate-500">24/7 Customer Support</p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card icon={<Phone className="h-6 w-6" />} tint="bg-sky-100 text-sky-600" title="Call Us">
            <div className="mt-3 grid grid-cols-2 gap-2">
              {HEAD.map((p) => (
                <a
                  key={p}
                  href={`tel:${p.replace(/\D/g, "")}`}
                  className="rounded-md bg-slate-50 px-2 py-1.5 text-xs font-medium"
                >
                  {p}
                </a>
              ))}
            </div>
          </Card>
          <Card icon={<MessageCircle className="h-6 w-6" />} tint="bg-emerald-100 text-emerald-600" title="Chat on WhatsApp">
            <a
              href="https://wa.me/2547103177255"
              className="mt-3 inline-block text-sm text-emerald-700 font-medium"
            >
              0103177255
            </a>
          </Card>
          <Card icon={<Mail className="h-6 w-6" />} tint="bg-amber-100 text-amber-600" title="Email Us">
            <a
              href="mailto:info@bus-car.co.ke"
              className="mt-3 inline-block text-sm text-amber-700 font-medium"
            >
              info@bus-car.co.ke
            </a>
          </Card>
          <Card icon={<Clock className="h-6 w-6" />} tint="bg-violet-100 text-violet-600" title="Availability">
            <p className="mt-3 text-xs text-slate-600">
              24/7, including weekends & public holidays
            </p>
          </Card>
        </div>

        <p className="mt-12 text-xs text-slate-500">
          BusCar © {new Date().getFullYear()} - All Rights Reserved
        </p>
      </section>
    </SiteLayout>
  );
}

function Card({
  icon,
  tint,
  title,
  children,
}: {
  icon: React.ReactNode;
  tint: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-6 flex flex-col items-center text-center">
      <div className={`h-14 w-14 rounded-full flex items-center justify-center ${tint}`}>
        {icon}
      </div>
      <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
      {children}
    </div>
  );
}
