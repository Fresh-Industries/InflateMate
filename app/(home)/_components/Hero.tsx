import { Button } from "@/components/ui/button";
import { ArrowRight, Play, BarChart2, CalendarCheck, Star } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative pt-16 md:pt-20 lg:pt-24 pb-16 md:pb-24 overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-primary/5 to-transparent"></div>
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-accent/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-40 left-20 w-80 h-80 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Mobile-optimized layout */}
          <div className="flex flex-col lg:flex-row items-center">
            {/* Left column - Content */}
            <div className="w-full lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-left mb-12 lg:mb-0 lg:pr-8">
              {/* Social proof above headline */}
              <div className="flex items-center justify-center lg:justify-start gap-1.5 text-sm text-text-light mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="font-medium">Trusted by 500+ bounce house businesses</span>
              </div>
              
              {/* Bold, impactful headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-DEFAULT">
                <span className="inline-block">Run Your Bounce House</span>{" "}
                <span className="inline-block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-300%">Business On Autopilot</span>
              </h1>
              
              {/* Clear, benefit-focused subheadline */}
              <p className="text-lg sm:text-xl text-text-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                The all-in-one platform that helps bounce house rental businesses book more events, reduce no-shows, and increase profits by up to 30%.
              </p>
              
              {/* Strong CTA section */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Button 
                  size="lg" 
                  variant="primary-gradient" 
                  className="h-14 px-8 rounded-full shadow-lg shadow-primary/20 group"
                >
                  <span className="font-bold">Get Started Now</span>
                  <div className="ml-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transform group-hover:translate-x-1 transition-all duration-300">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-14 px-8 rounded-full border-2 border-muted hover:bg-muted/30 text-text-DEFAULT transition-colors backdrop-blur-sm group"
                >
                  <div className="mr-2 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                    <Play className="w-3 h-3 text-accent fill-accent" />
                  </div>
                  <span>Watch Demo</span>
                </Button>
              </div>
              

             
            </div>
            
            {/* Right column - Visual */}
            <div className="w-full lg:w-1/2 relative">
              {/* Decorative elements */}
              <div className="absolute -inset-1 bg-gradient-to-r from-accent to-primary rounded-3xl blur-lg opacity-30 animate-pulse"></div>
              
              {/* Main dashboard visual */}
              <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/95 backdrop-blur-sm p-4 md:p-6 transform hover:translate-y-[-5px] transition-all duration-500 ease-in-out">
                {/* Dashboard image */}
                <div className="w-full aspect-[16/10] relative max-w-[580px] mx-auto rounded-lg overflow-hidden">
                  <Image
                    src="/images/hero-dashboard.png"
                    alt="InflateMate Dashboard"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                </div>
                
                {/* Floating stats cards - positioned for mobile and desktop */}
                <div className="absolute top-4 md:top-8 right-4 md:right-8 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 md:p-4 z-20 transform hover:scale-105 transition-all duration-300 border border-muted">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg p-2">
                      <BarChart2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-bold text-text-DEFAULT">Monthly Revenue</p>
                      <p className="text-base md:text-lg font-bold text-green-600">$12,580</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 md:p-4 z-20 transform hover:scale-105 transition-all duration-300 border border-muted">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg p-2">
                      <CalendarCheck className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-bold text-text-DEFAULT">This Weekend</p>
                      <p className="text-base md:text-lg font-bold text-blue-600">8 Bookings</p>
                    </div>
                  </div>
                </div>
                
                {/* Additional floating element for visual interest */}
                <div className="absolute -bottom-3 right-1/4 transform translate-x-1/2 bg-white rounded-xl shadow-lg p-3 z-10 border border-muted hidden md:block">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <p className="text-xs font-medium text-text-DEFAULT whitespace-nowrap">Payment received: $350</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      
    </section>
  );
}
