import Hero from "./_components/Hero";
import Features from "./_components/Features";
import Explainer from "./_components/Explainer";
import OperatorTypes from "./_components/OperatorTypes";
import Testimonial from "./_components/Testimonial";
import PricingPreview from "./_components/PricingPreview";
import FAQAccordion from "./_components/FAQAccordion";
import FinalCTA from "./_components/FinalCTA";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <Hero />
      <Features />
      <Explainer />
      <OperatorTypes />
      <Testimonial />
      <PricingPreview />
      <FAQAccordion />
      <FinalCTA />

    </main>
  );
}
