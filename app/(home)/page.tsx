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
      <Hero />
      <FeatureBento />
      <ProblemSolutionStrip />
      <WorkflowStoryboard />
      <DifferentiatorTable />
      <Suspense fallback={<div>Loading pricing...</div>}>
        <PricingList />
      </Suspense>
      <Faq />
      <SecondaryCTA />
    </main>
  );
}
