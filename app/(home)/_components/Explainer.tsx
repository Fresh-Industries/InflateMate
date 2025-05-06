import Image from "next/image";

export default function DashboardPreview() {
  return (
    <section className="bg-primary/10  py-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-text-DEFAULT">
          See InflateMate in Action
        </h2>
        <p className="text-lg md:text-xl text-text-light mb-10">
          Effortlessly manage bookings, customers, and payments—all from one beautiful dashboard.
        </p>
        <div className="flex justify-center">
          <div className="rounded-2xl shadow-lg overflow-hidden bg-white max-w-3xl w-full">
            <Image
              src="/images/hero-dashboard.png"
              alt="InflateMate Dashboard Screenshot"
              width={1200}
              height={700}
              className="object-cover w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
