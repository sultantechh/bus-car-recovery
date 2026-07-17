import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import {
  ArrowLeft,
  Bus,
  Clock,
  Star,
  Wifi,
  Zap,
  Armchair,
  Crown,
  Users,
} from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { searchTrips, type Trip } from "@/lib/iabiri.functions";
import { waLink, WHATSAPP_DISPLAY, discounted } from "@/lib/whatsapp";

const searchSchema = z.object({
  from: fallback(z.string(), "").default(""),
  to: fallback(z.string(), "").default(""),
  date: fallback(z.string(), "").default(""),
  source_id: fallback(z.number(), 0).default(0),
  destination_id: fallback(z.number(), 0).default(0),
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

const AMENITY_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  "1": { label: "Wi-Fi", icon: <Wifi className="h-3.5 w-3.5" /> },
  "2": { label: "Power", icon: <Zap className="h-3.5 w-3.5" /> },
  "3": { label: "Legroom", icon: <Armchair className="h-3.5 w-3.5" /> },
  "4": { label: "VIP", icon: <Crown className="h-3.5 w-3.5" /> },
  "5": { label: "Reclining", icon: <Armchair className="h-3.5 w-3.5" /> },
};

function categorizePrices(list: Trip["defaultTripPriceList"]) {
  const cats: { vip?: string; business?: string; normal?: string } = {};
  for (const p of list) {
    const t = p.seatType.toLowerCase();
    if (t.includes("vip")) cats.vip = p.amount;
    else if (t.includes("bclass") || t.includes("business")) cats.business = p.amount;
    else if (t.includes("normal") || t.includes("standard") || t.includes("regular"))
      cats.normal = p.amount;
    else cats.normal = cats.normal ?? p.amount;
  }
  return cats;
}

function money(amount?: string) {
  const n = discounted(amount);
  if (n === null) return null;
  return `KES ${n.toLocaleString()}`;
}

function SearchPage() {
  const { from, to, date, source_id, destination_id } = Route.useSearch();
  const navigate = useNavigate();
  const fetchTrips = useServerFn(searchTrips);

  const enabled = !!source_id && !!destination_id && !!date;
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["trips", source_id, destination_id, date],
    queryFn: () =>
      fetchTrips({
        data: {
          source_city_id: source_id,
          destination_city_id: destination_id,
          travel_date: date,
        },
      }),
    enabled,
  });

  const trips = data?.trips ?? [];

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
          <Bus className="h-4 w-4" />
          <div className="text-sm font-medium truncate">
            {from || "—"} <span className="text-neutral-500">→</span> {to || "—"}
            <span className="text-neutral-500 ml-2 hidden sm:inline">· {date || "—"}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between text-sm text-slate-600">
        <span className="font-medium">Search Results</span>
        <span>
          {isLoading ? "Searching…" : `${trips.length} Found`}
        </span>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16">
        {!enabled && (
          <EmptyState
            title="Enter search details"
            desc="Pick your origin, destination, and date on the home page to see buses."
          />
        )}

        {enabled && isLoading && (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-40 rounded-2xl bg-slate-100 animate-pulse"
              />
            ))}
          </div>
        )}

        {enabled && isError && (
          <div className="text-center py-16">
            <p className="text-slate-700 font-medium">Couldn't load buses</p>
            <button
              onClick={() => refetch()}
              className="mt-3 rounded-full border border-slate-300 px-4 py-2 text-sm"
            >
              Try again
            </button>
          </div>
        )}

        {enabled && !isLoading && !isError && trips.length === 0 && (
          <EmptyState
            title="No Buses Found"
            desc={data?.message ?? "We couldn't find any buses matching your criteria."}
          />
        )}

        <div className="space-y-4">
          {trips.map((t) => (
            <TripCard
              key={t.bus_id + t.route_id}
              trip={t}
              from={from}
              to={to}
              date={date}
            />
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}

function TripCard({ trip }: { trip: Trip }) {
  const prices = categorizePrices(trip.defaultTripPriceList);
  const amenities = trip.amenities
    .split(",")
    .map((s) => s.trim())
    .filter((s) => AMENITY_LABELS[s]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">{trip.bus_title}</h3>
            <span className="text-xs rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
              {trip.bus_type}
            </span>
            {trip.highWayDirectRoute && (
              <span className="text-xs rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5">
                {trip.highWayDirectRoute}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">{trip.trip_code}</p>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="font-semibold">{trip.avg_rating}</span>
          <span className="text-slate-400">({trip.rating_count})</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-lg font-bold">{trip.departure_time}</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500">
              Depart
            </div>
          </div>
          <div className="flex-1 flex items-center gap-1 text-xs text-slate-500">
            <div className="h-px flex-1 bg-slate-200" />
            <Clock className="h-3.5 w-3.5" />
            {trip.total_journey_time}
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{trip.arrival_time}</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500">
              Arrive
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:col-span-2 flex-wrap">
          {amenities.map((a) => (
            <span
              key={a}
              className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700"
            >
              {AMENITY_LABELS[a].icon}
              {AMENITY_LABELS[a].label}
            </span>
          ))}
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 ml-auto">
            <Users className="h-3.5 w-3.5" />
            {trip.available_seat_count} seats
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
        <PriceCat label="VIP" value={money(prices.vip)} tint="bg-violet-50 text-violet-700" />
        <PriceCat
          label="Business"
          value={money(prices.business)}
          tint="bg-amber-50 text-amber-700"
        />
        <PriceCat
          label="Normal"
          value={money(prices.normal)}
          tint="bg-emerald-50 text-emerald-700"
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-slate-500">
          From <span className="font-semibold text-slate-900">{money(trip.ticket_amount)}</span>
        </div>
        <button className="rounded-full bg-[#c8102e] px-5 py-2 text-sm font-semibold text-white hover:bg-[#a80d26]">
          Select Seats
        </button>
      </div>
    </div>
  );
}

function PriceCat({
  label,
  value,
  tint,
}: {
  label: string;
  value: string | null;
  tint: string;
}) {
  return (
    <div className={`rounded-xl ${tint} px-3 py-2`}>
      <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
        {label}
      </div>
      <div className="text-sm font-bold">{value ?? "—"}</div>
    </div>
  );
}

function EmptyState({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="py-20 flex flex-col items-center text-center">
      <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center">
        <Bus className="h-8 w-8 text-slate-500" />
      </div>
      <h2 className="mt-4 text-xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-slate-500 max-w-md">{desc}</p>
      <Link
        to="/"
        className="mt-6 rounded-full border border-emerald-500 px-5 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50"
      >
        Modify Search
      </Link>
    </div>
  );
}
