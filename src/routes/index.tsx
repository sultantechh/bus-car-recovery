import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Bus, MapPin, Calendar, Search } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { img } from "@/lib/assets";
import { getCities, type City } from "@/lib/iabiri.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BusCar — Eagle Above the Rest | Book Bus Tickets in Kenya" },
      {
        name: "description",
        content:
          "Book your next BusCar bus ticket online. Comfortable VIP seating, Wi-Fi, power outlets and multiple routes across Kenya.",
      },
      { property: "og:title", content: "BusCar — Book Bus Tickets in Kenya" },
      {
        property: "og:description",
        content: "Luxury coaches across Kenya. Book online in seconds.",
      },
    ],
  }),
  component: Home,
});

const amenities = [
  { name: "Free Wi-Fi", icon: "wifi", bg: "bg-sky-50" },
  { name: "Power Outlets", icon: "power", bg: "bg-emerald-50" },
  { name: "Extra Legroom", icon: "seats", bg: "bg-amber-50" },
  { name: "VIP Seating", icon: "vip", bg: "bg-violet-50" },
] as const;

const why = [
  { title: "Save", icon: "save", text: "Pay less when using our new Mobile App. You can save up to 25% of your Promo Cash balance in a single purchase." },
  { title: "Multiple Routes", icon: "routes", text: "We cover multiple routes and the widest connectivity in Kenya." },
  { title: "Earn Credits", icon: "fares", text: "Receive more credit during promotional periods which will be added into your Promo Cash account." },
  { title: "Parcel Delivery", icon: "package", text: "We Deliver parcels in all major towns in the country." },
  { title: "Fleet", icon: "bus", text: "Our Fleet has VIP Treatment, WiFi onboard, Power Outlets and Extra Legroom." },
  { title: "Widest Network", icon: "routes2", text: "Connecting Mombasa, Nairobi, Kisumu, Eldoret, Malindi, Lamu and more." },
] as const;

function Home() {
  const navigate = useNavigate();
  const [trip, setTrip] = useState<"one" | "round">("one");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);

  const fetchCities = useServerFn(getCities);
  const { data: cities = [] } = useQuery({
    queryKey: ["cities"],
    queryFn: () => fetchCities(),
    staleTime: 60 * 60_000,
  });

  const findCity = (name: string): City | undefined => {
    const n = name.trim().toUpperCase();
    if (!n) return undefined;
    return (
      cities.find((c) => c.city_name.toUpperCase() === n) ??
      cities.find((c) => c.city_name.toUpperCase().startsWith(n)) ??
      cities.find((c) => c.city_name.toUpperCase().includes(n))
    );
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const src = findCity(from);
    const dst = findCity(to);
    navigate({
      to: "/search",
      search: {
        from: src?.city_name ?? from,
        to: dst?.city_name ?? to,
        date,
        source_id: src ? Number(src.id) : 0,
        destination_id: dst ? Number(dst.id) : 0,
      },
    });
  };


  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 h-[420px] md:h-[520px]">
          <img src={img.hero1} alt="BusCar coach" className="h-full w-full object-cover" />
          <img src={img.hero2} alt="BusCar coach" className="h-full w-full object-cover" />
        </div>

        {/* Search card */}
        <div className="mx-auto max-w-6xl px-4 -mt-24 relative z-10">
          <div className="rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={trip === "one"}
                    onChange={() => setTrip("one")}
                    className="accent-[#c8102e]"
                  />
                  <span className="text-sm font-medium">One Way</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={trip === "round"}
                    onChange={() => setTrip("round")}
                    className="accent-[#c8102e]"
                  />
                  <span className="text-sm font-medium">Round Trip</span>
                </label>
              </div>
              <a
                href="https://www.travler.africa/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-600"
              >
                Book your next ticket using
                <img src={img.travler} alt="Travler" className="h-5" />
              </a>
            </div>

            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-5">
              <Field icon={<Bus className="h-4 w-4" />} label="FROM">
                <input
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="Source city"
                  list="buscar-cities"
                  className="w-full outline-none text-sm font-medium bg-transparent"
                />
              </Field>
              <Field icon={<MapPin className="h-4 w-4" />} label="TO">
                <input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Destination city"
                  list="buscar-cities"
                  className="w-full outline-none text-sm font-medium bg-transparent"
                />
              </Field>

              <Field icon={<Calendar className="h-4 w-4" />} label="TRAVEL DATE">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full outline-none text-sm font-medium bg-transparent"
                />
              </Field>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-4 text-sm font-semibold text-white hover:bg-slate-800"
              >
                <Search className="h-4 w-4" /> SEARCH BUS
              </button>
            </form>
            <datalist id="buscar-cities">
              {cities.map((c) => (
                <option key={c.id} value={c.city_name} />
              ))}
            </datalist>
          </div>
        </div>
      </section>


      {/* Amenities */}
      <section className="mx-auto max-w-6xl px-4 mt-16">
        <h2 className="text-2xl font-bold">Amenities</h2>
        <p className="text-sm text-slate-500 mt-1">
          Travel in comfort with our premium facilities
        </p>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {amenities.map((a) => (
            <div
              key={a.name}
              className={`${a.bg} rounded-2xl p-6 flex flex-col items-center text-center`}
            >
              <div className="h-16 w-16 rounded-full bg-white shadow-sm flex items-center justify-center">
                <img src={img[a.icon]} alt={a.name} className="h-9 w-9 object-contain" />
              </div>
              <p className="mt-3 text-sm font-semibold">{a.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="mx-auto max-w-6xl px-4 mt-16">
        <h2 className="text-2xl font-bold">Why Us</h2>
        <p className="text-sm text-slate-500 mt-1">
          Experience the best transport service in the region
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {why.map((w) => (
            <div
              key={w.title}
              className="rounded-2xl border border-slate-200 p-5 flex gap-4 hover:shadow-md transition"
            >
              <div className="h-14 w-14 shrink-0 rounded-xl bg-rose-50 flex items-center justify-center">
                <img src={img[w.icon]} alt={w.title} className="h-8 w-8 object-contain" />
              </div>
              <div>
                <h3 className="font-semibold">{w.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{w.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promo */}
      <section className="mx-auto max-w-6xl px-4 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <img src={img.cta1} alt="Promo" className="w-full rounded-2xl object-cover" />
          <img src={img.cta2} alt="Promo" className="w-full rounded-2xl object-cover" />
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
      <div className="text-slate-500">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-semibold tracking-wider text-slate-500">
          {label}
        </div>
        {children}
      </div>
    </div>
  );
}
