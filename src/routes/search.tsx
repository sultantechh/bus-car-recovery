import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { ArrowLeft, Bus, MapPin, Clock, Star, ChevronDown } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";

const searchSchema = z.object({
  from: fallback(z.string(), "").default(""),
  to: fallback(z.string(), "").default(""),
  date: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Search Results — BusCar" },
      { name: "description", content: "Find BusCar buses matching your travel criteria." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { from, to, date } = Route.useSearch();
  const navigate = useNavigate();

  return (
    <SiteLayout>
      <div className="bg-neutral-900 text-white">
        <div className="mx-auto max-w-7xl px-4 h-12 flex items-center gap-4">
          <button
            onClick={() => navigate({ to: "/" })}
            className="p-1.5 rounded hover:bg-white/10"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 rounded bg-white/10 px-2.5 py-1">
            <Bus className="h-4 w-4" />
          </div>
          <div className="text-sm font-medium truncate">
            {from || "—"} <span className="text-neutral-500">→</span> {to || "—"}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-4 flex flex-wrap items-center gap-3">
        <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Modify Trip
        </button>
        <FilterChip icon={<MapPin className="h-4 w-4" />} label="Boarding" />
        <FilterChip icon={<MapPin className="h-4 w-4" />} label="Dropping" />
        <FilterChip icon={<Clock className="h-4 w-4" />} label="Departure" />
        <FilterChip icon={<Star className="h-4 w-4" />} label="Amenities" />
      </div>

      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between text-sm text-slate-600">
        <span>Search Result</span>
        <span>0 Found</span>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 flex flex-col items-center text-center">
        <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center">
          <Bus className="h-8 w-8 text-slate-500" />
        </div>
        <h2 className="mt-4 text-xl font-semibold">No Buses Found</h2>
        <p className="mt-1 text-sm text-slate-500">
          We couldn't find any buses matching your criteria.
        </p>
        <p className="mt-1 text-xs text-slate-400">
          {from || "—"} → {to || "—"} · {date || "any date"}
        </p>
        <Link
          to="/"
          className="mt-6 rounded-full border border-emerald-500 px-5 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50"
        >
          Modify Search
        </Link>
      </div>
    </SiteLayout>
  );
}

function FilterChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">
      {icon}
      {label}
      <ChevronDown className="h-3.5 w-3.5" />
    </button>
  );
}
