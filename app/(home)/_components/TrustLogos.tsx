export default function TrustLogos() {
  return (
    <section className="py-8 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {["BounceKings", "PartyBounce", "JumpMasters", "InflateFun", "AirCastle"].map((company, i) => (
            <div
              key={company}
              className={`text-xl md:text-2xl font-extrabold tracking-tight px-4 py-2 rounded-full shadow-sm bg-gradient-to-r from-blue-100 to-purple-100 text-primary/80 hover:from-primary/10 hover:to-accent/10 hover:text-primary transition-colors duration-200 ${i % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 