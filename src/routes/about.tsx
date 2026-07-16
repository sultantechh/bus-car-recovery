import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { img } from "@/lib/assets";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About BusCar — Eagle Above the Rest" },
      {
        name: "description",
        content:
          "Luxurious buses, individual seatbelts, VIP seats and on-board entertainment across East Africa.",
      },
      { property: "og:title", content: "About BusCar" },
      { property: "og:description", content: "The king of comfort on East African roads." },
      { property: "og:image", content: img.gallery[4] },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-2 gap-10 items-start">
        <img
          src={img.gallery[4]}
          alt="BusCar coach"
          className="w-full rounded-2xl object-cover shadow-md"
        />
        <div className="rounded-2xl border border-slate-200 p-8">
          <h1 className="text-3xl font-bold">About Us</h1>
          <p className="mt-1 text-sm font-semibold text-[#c8102e]">BusCar</p>

          <h2 className="mt-6 text-lg font-semibold">About Buscar</h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Providing luxurious buses, on board entertainment, individual seat belts and
            many others, BUSCAR has truly embraced a new way of road travel in East Africa.
            With an online booking system for fast and accurate bookings, giving our
            passengers the luxury to plan their journeys with us.
          </p>

          <h2 className="mt-6 text-lg font-semibold">The King of Comfort</h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            With spacious and comfortable interior, our buses offer individual seatbelts,
            VIP seats, plug points and many other creature comforts making your journey
            with us a memorable one. Our passengers can watch a selection of movies inside
            the bus using the built-in entertainment system. Our crew are well trained,
            friendly and experienced.
          </p>

          <h2 className="mt-6 text-lg font-semibold">Safety our Priority</h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Our buses are designed with emergency exits located on positions easily
            accessible in case of emergencies. By putting safety as our utmost priority
            our buses are well maintained and our crew are well trained to give you the
            best possible safety assurance.
          </p>
          <p className="mt-6 text-sm font-semibold text-[#c8102e]">BusCar</p>
        </div>
      </section>
    </SiteLayout>
  );
}
