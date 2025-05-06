import Image from "next/image";

const features = [
  {
    title: "Analytics Dashboard",
    description: "Track revenue, bookings, and trends with beautiful charts.",
    image: "/images/analytics.png",
    className: "lg:col-span-2",
  },
  {
    title: "Marketing Tools",
    description: "Send coupons, run promotions, and capture more leads.",
    image: "/images/marketing.png",
    className: "",
  },
  {
    title: "Advanced Reports",
    description: "Export detailed reports for accounting and planning.",
    image: "/images/reports.png",
    className: "",
  },
  {
    title: "Conversion Tracking",
    description: "See which channels drive the most bookings.",
    image: "/images/conversion.png",
    className: "lg:col-span-2",
  },
];

export default function GrowthAnalytics() {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium mb-4">
            Growth & Analytics
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 tracking-tight text-text-DEFAULT">
            Grow Faster with{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Actionable Insights
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-text-light leading-relaxed">
            Make smarter decisions with real-time analytics and marketing tools built for rental businesses.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`
                group relative flex flex-col justify-between
                bg-surface rounded-2xl border border-muted/40
                p-5 sm:p-6 md:p-8
                transition duration-200
                ${feature.className}
                min-h-[220px] sm:min-h-[240px] md:min-h-[260px]
                shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                outline-none
              `}
              tabIndex={0}
            >
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-text-DEFAULT">
                  {feature.title}
                </h3>
                <p className="text-text-light text-base sm:text-[1.08rem] mb-4">
                  {feature.description}
                </p>
              </div>
              <div className="relative w-full h-28 sm:h-32 md:h-36 mt-auto flex items-end">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-contain rounded-xl pointer-events-none select-none"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  priority={i === 0}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-muted/40 to-transparent pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
