import Hero from "./_components/Hero";
import FeaturesBento from "./_components/FeaturesBento";
import ProblemSolutionStrip from "./_components/ProblemSolutionStrip";
import WorkflowStoryboard from "./_components/WorkflowStoryboard";
import DemoPlayer from "./_components/DemoPlayer";
import DifferentiatorTable from "./_components/DifferentiatorTable";
import PricingList from "./_components/PricingList";
import FoundersRoadmap from "./_components/FoundersRoadmap";
import Faq from "./_components/Faq";
import SecondaryCTA from "./_components/SecondaryCTA";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <Hero />
      <FeaturesBento />
      <ProblemSolutionStrip />
      <WorkflowStoryboard />
      <DemoPlayer />
      <DifferentiatorTable />
      <Suspense fallback={<div>Loading pricing...</div>}>
        <PricingList />
      </Suspense>
      <FoundersRoadmap />
      <Faq />
      <SecondaryCTA />
    </main>
  );
}
