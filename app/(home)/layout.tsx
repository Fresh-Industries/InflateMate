import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#F3F4F6]">
        {/* Brand‑tinted background accents – subtle and performance friendly */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(60rem 40rem at 85% -10%, rgba(99,102,241,0.08), transparent), radial-gradient(40rem 30rem at -10% 25%, rgba(45,212,191,0.06), transparent)",
          }}
        />
        <Navbar />
        <div className="relative">{children}</div>
        <Footer />
      </div>
    );
  } 