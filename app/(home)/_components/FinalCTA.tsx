import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-24 bg-gradient-to-r from-primary to-accent relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center text-white relative z-10 space-y-6">
          <h2 className="text-4xl font-bold">
            Ready to transform your rental business?
          </h2>
          <p className="text-xl text-white/90 leading-relaxed">
            Join the early adopters using InflateMate to streamline operations, increase bookings, and boost profits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="h-14 px-8 rounded-full bg-white text-primary hover:text-accent hover:bg-blue-50 shadow-lg hover:scale-105 transition-all">
              Start 14-Day Free Trial
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-2 border-white/50 text-white hover:bg-white/10 hover:border-white transition-all">
              Schedule a Demo <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 