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
import { waLink, discounted } from "@/lib/whatsapp";

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

function TripCard({
  trip,
  from,
  to,
  date,
}: {
  trip: Trip;
  from: string;
  to: string;
  date: string;
}) {
  const prices = categorizePrices(trip.defaultTripPriceList);
  const amenities = trip.amenities
    .split(",")
    .map((s) => s.trim())
    .filter((s) => AMENITY_LABELS[s]);
  const cheapest = money(trip.ticket_amount);
  const bookMessage =
    `Hi BusCar, I'd like to book a seat.\n\n` +
    `Route: ${from || "?"} → ${to || "?"}\n` +
    `Date: ${date || "?"}\n` +
    `Bus: ${trip.bus_title} (${trip.bus_type})\n` +
    `Departure: ${trip.departure_time}\n` +
    `Trip code: ${trip.trip_code}\n` +
    (cheapest ? `Fare from: ${cheapest}\n` : "") +
    `\nPlease confirm availability and seat selection.`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
              {trip.bus_title}
            </h3>
            <span className="text-[10px] sm:text-xs rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
              {trip.bus_type}
            </span>
            {trip.highWayDirectRoute && (
              <span className="text-[10px] sm:text-xs rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5">
                {trip.highWayDirectRoute}
              </span>
            )}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">{trip.trip_code}</p>
        </div>
        <div className="flex items-center gap-1 text-sm shrink-0">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="font-semibold">{trip.avg_rating}</span>
          <span className="text-slate-400 hidden sm:inline">({trip.rating_count})</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-base sm:text-lg font-bold">{trip.departure_time}</div>
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
            <div className="text-base sm:text-lg font-bold">{trip.arrival_time}</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500">
              Arrive
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:col-span-2 flex-wrap">
          {amenities.map((a) => (
            <span
              key={a}
              className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-medium text-sky-700"
            >
              {AMENITY_LABELS[a].icon}
              {AMENITY_LABELS[a].label}
            </span>
          ))}
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-600 sm:ml-auto">
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

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-xs text-slate-500">
          From <span className="font-semibold text-slate-900">{cheapest}</span>
          <span className="ml-2 rounded-full bg-rose-50 text-rose-600 px-2 py-0.5 text-[10px] font-semibold">
            20% OFF
          </span>
        </div>
        <a
          href={waLink(bookMessage)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
            <path d="M20.5 3.5A11.9 11.9 0 0 0 12 0C5.4 0 .1 5.3.1 11.9c0 2.1.6 4.1 1.6 5.9L0 24l6.4-1.7a12 12 0 0 0 5.6 1.4h.01c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.4-8.3zM12 21.3h-.01a9.4 9.4 0 0 1-4.8-1.3l-.35-.2-3.8 1 1-3.7-.23-.38A9.5 9.5 0 1 1 21.5 12c0 5.24-4.27 9.3-9.5 9.3zm5.4-7c-.3-.15-1.75-.86-2-.96-.28-.1-.48-.15-.68.15-.2.3-.77.96-.94 1.16-.17.2-.34.22-.64.08a7.7 7.7 0 0 1-3.83-3.34c-.29-.5.29-.46.83-1.55.09-.2.05-.36-.02-.5-.08-.15-.68-1.63-.93-2.23-.24-.58-.5-.5-.68-.5H8a1.3 1.3 0 0 0-.94.44 3.9 3.9 0 0 0-1.2 2.9c0 1.71 1.24 3.36 1.41 3.59.17.22 2.44 3.73 5.9 5.23a19.8 19.8 0 0 0 1.97.73c.83.26 1.58.22 2.18.13.66-.1 2.03-.83 2.32-1.63.28-.8.28-1.48.2-1.62-.08-.15-.28-.23-.58-.38z" />
          </svg>
          Book on WhatsApp
        </a>
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
