import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { img } from "@/lib/assets";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — BusCar Fleet & Services" },
      { name: "description", content: "Take a look at our fleet and services." },
      { property: "og:title", content: "BusCar Gallery" },
      { property: "og:description", content: "Photos of our luxury coaches and service." },
      { property: "og:image", content: img.gallery[0] },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="text-center">
          <h1 className="inline-block text-3xl font-bold border-b-4 border-emerald-500 pb-2">
            Our Gallery
          </h1>
          <p className="mt-4 text-sm text-slate-500">
            Take a look at our fleet and services
          </p>
        </div>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {img.gallery.map((src, i) => (
            <div key={src} className="aspect-square overflow-hidden rounded-xl shadow-sm">
              <img
                src={src}
                alt={`Gallery ${i + 1}`}
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
