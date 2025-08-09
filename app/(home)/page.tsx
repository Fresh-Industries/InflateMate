import Hero from "./_components/Hero";
import { FeatureBento } from "./_components/FeaturesBento";
import ProblemSolutionStrip from "./_components/ProblemSolutionStrip";
import WorkflowStoryboard from "./_components/WorkflowStoryboard";
import DifferentiatorTable from "./_components/DifferentiatorTable";
import PricingList from "./_components/PricingList";
import Faq from "./_components/Faq";
import SecondaryCTA from "./_components/SecondaryCTA";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      {/* Hero on white */}
      <section className="bg-white">
        <Hero />
      </section>

      {/* Features on very light indigo tint (opacity applied) */}
      <section className="bg-[#6366F1]/[0.2]">
        <FeatureBento />
      </section>

      {/* Problems strip on white */}
      <section className="bg-white">
        <ProblemSolutionStrip />
      </section>

      {/* Workflow on very light teal tint (opacity applied) */}
      <section className="bg-[#2DD4BF]/[0.2]">
        <WorkflowStoryboard />
      </section>

      {/* Differentiator + Pricing on white to keep tables crisp */}
      <section className="bg-white">
        <DifferentiatorTable />
      </section>
      <Suspense fallback={<div>Loading pricing...</div>}>
        <section className="bg-white p-5">
          <PricingList />
        </section>
      </Suspense>

      {/* FAQ on a light yellow wash for warmth (opacity applied) */}
      <section className="bg-white">
        <Faq />
      </section>

      {/* Footer CTA on white */}
      <section className="bg-white">
        <SecondaryCTA />
      </section>
    </main>
  );
}
