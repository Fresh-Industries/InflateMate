import { Badge } from "@/components/ui/badge"; // Assuming Badge is from your UI library
import { User, Users, Building } from "lucide-react"; // Using more specific Lucide icons

export default function OperatorTypes() {
  const operators = [
    {
      icon: <User className="h-6 w-6 text-primary" />, // Added icon
      title: "Solo Operators",
      description:
        "Perfect for individuals running a one-person rental business. Simple, streamlined tools to save you time.",
    },
    {
      icon: <Users className="h-6 w-6 text-accent" />, // Added icon
      title: "Family Businesses",
      description:
        "Ideal for small teams or family-run operations. Collaborate, manage inventory, and keep everyone in sync.",
    },
    {
      icon: <Building className="h-6 w-6 text-purple-600" />, // Added icon, using a specific purple for variety
      title: "Growing Teams",
      description:
        "For expanding companies with multiple staff. Advanced permissions, analytics, and multi-user support.",
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-background">
      <div className="max-w-5xl mx-auto text-center"> {/* Increased max-width slightly for better grid spacing */}
        {/* Section Header with Badge */}
        <Badge className="bg-primary/10 text-primary px-4 py-1.5 text-sm rounded-full font-medium mb-4">
          Who is InflateMate For? {/* More benefit-oriented text */}
        </Badge>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 md:mb-10 text-text-DEFAULT tracking-tight">
          Built for Every Operator{" "} {/* Keeping the main heading */}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
             Type
          </span>
        </h2>
        <p className="text-lg md:text-xl text-text-light leading-relaxed max-w-2xl mx-auto mb-12 md:mb-16"> {/* Added max-width and bottom margin */}
          Whether you&apos;re just starting out or scaling rapidly, InflateMate has the tools you need to succeed.
        </p>

        {/* Improved Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"> {/* Adjusted gaps for better spacing */}
          {operators.map((op, i) => (
            <div
              key={i}
              className="
                bg-surface border border-muted/60 rounded-2xl p-6 md:p-8
                flex flex-col items-start text-left relative {/* Left-align content */}
                shadow-md hover:shadow-lg transition-all duration-300 {/* Improved shadow */}
                hover:translate-y-[-4px] {/* Subtle lift on hover */}
                cursor-pointer group
                outline-none focus-visible:ring-2 focus-visible:ring-primary {/* Accessibility */}
              "
              tabIndex={0} // Make the card focusable
            >
              {/* Icon Container with Background Circle */}
              <div className={`
                w-12 h-12 rounded-full mb-6
                flex items-center justify-center
                bg-muted/50 group-hover:bg-primary/10 {/* Dynamic background color */}
                transition-colors duration-300
              `}>
                 {/* Clone icon here to change color on hover if needed */}
                 {/* For simplicity, using the icon directly, assuming its color is set by parent text or defined */}
                 {op.icon}
              </div>

              {/* Card Content */}
              <h3 className="text-xl font-bold mb-3 text-text-DEFAULT"> {/* Adjusted spacing */}
                {op.title}
              </h3>
              <p className="text-text-light text-base flex-grow"> {/* Use flex-grow to push content down if needed */}
                {op.description}
              </p>

              {/* Optional: Arrow on Hover */}
              <div className="mt-6 flex justify-end w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-primary group-hover:translate-x-1 transition-transform"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
