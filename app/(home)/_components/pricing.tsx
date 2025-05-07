'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import { CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";


export default function Pricing() {

    

        return (
        <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 hover:from-green-500/20 hover:to-emerald-500/20 px-4 py-2 text-sm rounded-full border border-green-200/30 shadow-sm backdrop-blur-sm mb-4">
              Simple Pricing
            </Badge>
            <h2 className="text-4xl font-bold mb-6">
              One Simple Plan for <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Everyone</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              No hidden fees, no complicated tiers. Just one straightforward price.
            </p>
          </div>
          
          <div className="max-w-lg mx-auto">
            <Card className="border-none shadow-2xl hover:shadow-3xl transition-all rounded-2xl overflow-hidden bg-white relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
              
              <CardHeader className="pb-2 relative">
                <CardTitle className="text-2xl font-bold text-gray-800">InflateMate Pro</CardTitle>
                <div className="mt-2 flex items-end">
                  <span className="text-5xl font-bold text-gray-800">$80</span>
                  <span className="text-gray-500 ml-2 mb-1">/month</span>
                </div>
                <CardDescription className="text-base mt-2">Everything you need to manage your bounce house business</CardDescription>
              </CardHeader>
              
              <CardContent className="relative">
                <ul className="space-y-4 mt-4">
                  {[
                    "Unlimited bounce houses/inflatables",
                    "Online booking system",
                    "Customer management & CRM",
                    "Payment processing",
                    "Detailed analytics",
                    "Custom booking website",
                    "Email & SMS notifications",
                    "Priority support"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-4 relative">
                <Button onClick={() => window.location.href = '/sign-up'} className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                  Start Your 14-Day Free Trial
                </Button>
                <p className="text-sm text-gray-500 text-center flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>No credit card required. Cancel anytime.</span>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    );
}