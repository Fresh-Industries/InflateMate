import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

// Updated plans data with features lists
const plans = [
  {
    name: "Solo",
    price: "$60",
    description: "Perfect for individuals just getting started.",
    highlight: false,
    features: [
      "1 user account",
      "Unlimited bookings",
      "Customer management",
      "Invoicing & payments",
      "Basic reports",
      "Email support",
    ]
  },
  {
    name: "Growth",
    price: "$99",
    description: "Ideal for expanding teams and operations.",
    highlight: true, // This plan will be visually highlighted
    features: [
      "Up to 5 user accounts",
      "Unlimited bookings",
      "Advanced CRM",
      "Invoicing & payments",
      "SMS notifications",
      "Embedded components",
      "Advanced analytics",
      "Priority email support",
    ]
  }
];

export default function PricingPreview() {
  return (
    <section className="py-16 md:py-24"> 
    <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-primary/5 to-transparent"></div>
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-accent/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-40 left-20 w-80 h-80 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
           <Badge className="bg-primary/10 text-primary px-4 py-1.5 text-sm rounded-full font-medium mb-4">
             Simple & Transparent
           </Badge>
           <h2 className="text-3xl md:text-4xl font-extrabold mb-4 md:mb-6 tracking-tight text-text-DEFAULT">
             Simple, <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">transparent pricing</span>
           </h2>
           <p className="text-lg md:text-xl text-text-light leading-relaxed">
             No hidden fees. No complicated tiers. Just pick the plan that fits your business today.
           </p>
        </div>

        {/* Pricing Cards Container */}
        {/* Use a max-width that accommodates both cards comfortably side-by-side with gap */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-5xl mx-auto justify-center">
          {plans.map((plan, i) => (
            <Card
              key={i}
              // Card Styling - Adopt border, shadow, and potential highlight style
              className={`
                flex-1 flex flex-col
                border border-muted/60 rounded-2xl shadow-xl overflow-hidden bg-surface relative
                transition-all duration-300 hover:shadow-2xl hover:translate-y-[-4px]
                ${plan.highlight ? "lg:scale-105 lg:translate-y-[-12px] border-primary/80" : ""} {/* Highlight effect */}
              `}
            >
              {/* Optional top border gradient for highlighted card */}
              {plan.highlight && (
                 <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent"></div>
              )}
              
              <CardHeader className="pb-6 md:pb-8 relative text-center">
                {/* Optional Highlight Badge */}
                {plan.highlight && (
                   <div className="absolute -top-3 right-6 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                     Recommended
                   </div>
                )}
                
                <CardTitle className="text-2xl font-bold text-text-DEFAULT">{plan.name}</CardTitle>
                <div className="mt-4 flex items-center justify-center">
                  <span className="text-5xl md:text-6xl font-extrabold text-text-DEFAULT">{plan.price}</span>
                  <span className="text-text-light ml-2 mb-1 text-lg">/month</span>
                </div>
                <CardDescription className="text-base mt-2 text-text-light max-w-xs mx-auto">{plan.description}</CardDescription>
              </CardHeader>

              {/* Card Content - Features List */}
              <CardContent className="p-6 md:p-8 border-t border-muted/60 flex-grow"> {/* Added flex-grow */}
                <ul className="space-y-3 text-left"> {/* Left-align list */}
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                       {/* Gradient Icon */}
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0 flex items-center justify-center mt-0.5">
                         <CheckCircle2 className="h-3 w-3 text-white" />
                       </div>
                      <span className="text-text-DEFAULT text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              {/* Card Footer - CTA Button */}
              <CardFooter className="p-6 md:p-8 border-t border-muted/60">
                 <Button
                    // Use your primary-gradient variant or inline gradient classes
                    className={`w-full h-14 rounded-xl text-white shadow-lg transition-all duration-300 transform ${
                       plan.highlight
                         ? "bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark hover:scale-[1.02] shadow-primary/40" // Highlighted button style
                         : "bg-muted-foreground hover:bg-muted-foreground/90 shadow-muted/40" // Standard button style (can be outline too)
                    }`}
                    // Assuming a button variant if you have one: variant={plan.highlight ? "primary-gradient" : "default"}
                 >
                    {plan.highlight ? "Get Started with Growth" : "Get Started with Solo"} {/* Specific CTA text */}
                 </Button>
                 {/* Optional small text below button */}
                 <p className="text-sm text-text-light text-center mt-4">
                    No credit card required
                 </p>
              </CardFooter>
            </Card>
          ))}
        </div>



      </div>
    </section>
  );
}
