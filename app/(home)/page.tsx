import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarCheck, 
  BarChart, 
  Users, 
  CreditCard, 
  Smartphone, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  PartyPopper,
  ChevronRight,
  Play,
  Shield,
  Rocket
} from "lucide-react";
import Image from "next/image";
import Pricing from "./_components/pricing";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/50 to-white pointer-events-none"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_800px_at_100%_20%,rgba(59,130,246,0.1),transparent)]"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_600px_at_0%_50%,rgba(147,51,234,0.1),transparent)]"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
                <Badge className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 px-4 py-2 text-sm rounded-full border border-blue-200/30 shadow-sm backdrop-blur-sm">
                  Introducing Inflatemate 1.0
                </Badge>
                
                <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
                  Bounce House Management <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Simplified</span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  The all-in-one platform that helps bounce house rental businesses streamline operations, increase bookings, and maximize profits.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button size="lg" className="h-14 px-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                    <span>Start Free Trial</span>
                    <div className="ml-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transform group-hover:rotate-45 transition-all duration-300">
                      <ArrowRight className="w-3 h-3 text-white" />
                    </div>
                  </Button>
                  <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-2 border-blue-400/50 text-blue-600 hover:bg-blue-50/50 hover:border-blue-500 transition-all duration-300 backdrop-blur-sm group">
                    <div className="mr-2 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <Play className="w-3 h-3 text-blue-600 fill-blue-600" />
                    </div>
                    <span>Watch Demo</span>
                  </Button>
                </div>
                
                <div className="flex items-center justify-center lg:justify-start gap-3 pt-4">
                  <div className="flex items-center gap-1.5">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600">14-day free trial</span>
                  </div>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600">No credit card required</span>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2 relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-lg opacity-30 animate-pulse"></div>
                <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white/50 bg-white/90 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-full aspect-[580/375] relative max-w-[580px] mx-auto">
                    <Image 
                      src="/images/hero-dashboard.png" 
                      alt="InflateMate Dashboard" 
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  
                  {/* Floating UI Elements */}
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 z-20 transform hover:scale-105 transition-all duration-300 border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg p-2">
                        <BarChart className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">Monthly Revenue</p>
                        <p className="text-lg font-bold text-green-600">$12,580</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 z-20 transform hover:scale-105 transition-all duration-300 border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg p-2">
                        <CalendarCheck className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">This Weekend</p>
                        <p className="text-lg font-bold text-blue-600">8 Bookings</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500 mb-8 text-sm font-medium tracking-wider uppercase">TRUSTED BY BOUNCE HOUSE BUSINESSES NATIONWIDE</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {['BounceKings', 'JumpMasters', 'InflateFun', 'PartyBounce', 'AirCastle'].map((company) => (
              <div key={company} className="text-xl font-bold text-gray-300 hover:text-blue-500 transition-colors">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_800px_at_50%_0%,rgba(59,130,246,0.05),transparent)]"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 hover:from-purple-500/20 hover:to-pink-500/20 px-4 py-2 text-sm rounded-full border border-purple-200/30 shadow-sm backdrop-blur-sm mb-4">
              Powerful Features
            </Badge>
            <h2 className="text-4xl font-bold mb-6">
              Everything You Need to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Grow Your Business</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Our platform is designed specifically for bounce house rental businesses to streamline operations and boost profits.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <CalendarCheck className="h-8 w-8 text-white" />,
                title: "Smart Booking System",
                description: "Effortlessly manage reservations, prevent double-bookings, and send automated confirmations.",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                icon: <Users className="h-8 w-8 text-white" />,
                title: "Customer Management",
                description: "Build lasting relationships with detailed customer profiles and booking history.",
                gradient: "from-purple-500 to-purple-600"
              },
              {
                icon: <CreditCard className="h-8 w-8 text-white" />,
                title: "Seamless Payments",
                description: "Accept deposits and full payments online with our secure payment integrations.",
                gradient: "from-pink-500 to-pink-600"
              },
              {
                icon: <Smartphone className="h-8 w-8 text-white" />,
                title: "Mobile Optimized",
                description: "Manage your business on the go with our fully responsive mobile experience.",
                gradient: "from-indigo-500 to-indigo-600"
              },
              {
                icon: <BarChart className="h-8 w-8 text-white" />,
                title: "Powerful Analytics",
                description: "Gain insights into your most popular items, peak booking times, and revenue trends.",
                gradient: "from-green-500 to-green-600"
              },
              {
                icon: <Zap className="h-8 w-8 text-white" />,
                title: "Automated Marketing",
                description: "Send targeted promotions, follow-ups, and special offers to boost repeat bookings.",
                gradient: "from-yellow-500 to-yellow-600"
              }
            ].map((feature, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden bg-white group">
                <CardHeader className="pb-2">
                  <div className={`bg-gradient-to-br ${feature.gradient} w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="p-0 text-blue-600 hover:text-blue-700 group-hover:translate-x-2 transition-all duration-300">
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-white via-blue-50/50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_800px_at_0%_50%,rgba(147,51,234,0.05),transparent)]"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_800px_at_100%_50%,rgba(59,130,246,0.05),transparent)]"></div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 hover:from-blue-500/20 hover:to-indigo-500/20 px-4 py-2 text-sm rounded-full border border-blue-200/30 shadow-sm backdrop-blur-sm mb-4">
              Simple Process
            </Badge>
            <h2 className="text-4xl font-bold mb-6">
              Get Started in <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Three Easy Steps</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              We&apos;ve made it incredibly simple to get your bounce house business online and running efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-24 left-0 w-full h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 z-0"></div>
            
            {[
              {
                step: 1,
                title: "Create Your Account",
                description: "Sign up for your free trial and set up your business profile in minutes.",
                icon: <Rocket className="h-7 w-7 text-white" />,
                gradient: "from-blue-500 to-indigo-500"
              },
              {
                step: 2,
                title: "Add Your Inventory",
                description: "Upload your bounce houses, set pricing, and customize booking rules.",
                icon: <PartyPopper className="h-7 w-7 text-white" />,
                gradient: "from-indigo-500 to-purple-500"
              },
              {
                step: 3,
                title: "Start Taking Bookings",
                description: "Share your booking link and watch the reservations roll in!",
                icon: <Sparkles className="h-7 w-7 text-white" />,
                gradient: "from-purple-500 to-pink-500"
              }
            ].map((step, index) => (
              <div key={index} className="relative z-10 flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg mb-6`}>
                  {step.icon}
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-sm font-bold text-blue-600 border border-blue-100">
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <Pricing />

      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-b from-white via-blue-50/50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 hover:from-purple-500/20 hover:to-pink-500/20 px-4 py-2 text-sm rounded-full border border-purple-200/30 shadow-sm backdrop-blur-sm mb-4">
              Common Questions
            </Badge>
            <h2 className="text-4xl font-bold mb-6">
              Frequently Asked <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Everything you need to know about InflateMate
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                question: "How long is the free trial?",
                answer: "Our free trial lasts for 14 days, giving you plenty of time to explore all features and see how InflateMate can transform your bounce house business."
              },
              {
                question: "Do I need technical skills to use InflateMate?",
                answer: "Not at all! InflateMate is designed to be user-friendly with an intuitive interface. If you can use a smartphone, you can use InflateMate."
              },
              {
                question: "Can I accept payments through InflateMate?",
                answer: "Yes! InflateMate integrates seamlessly with popular payment processors to allow you to accept deposits and full payments online."
              },
              {
                question: "Is there a limit to how many bounce houses I can manage?",
                answer: "No! Our plan includes unlimited inventory management, so you can add as many bounce houses and inflatables as you need."
              },
              {
                question: "Can I customize my booking rules?",
                answer: "Absolutely! Set your own buffer times between bookings, minimum notice periods, deposit requirements, and more to match your business operations."
              },
              {
                question: "What kind of support do you offer?",
                answer: "We offer email support with fast response times, detailed documentation, video tutorials, and a growing community of bounce house business owners."
              }
            ].map((faq, index) => (
              <Card key={index} className="border border-gray-100 shadow-md hover:shadow-lg transition-all rounded-xl overflow-hidden bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-800">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl"></div>
            
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white text-center overflow-hidden">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:100px_100px]"></div>
              
              <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
                <Badge className="bg-white/20 text-white hover:bg-white/30 px-4 py-2 text-sm rounded-full backdrop-blur-sm">
                  Limited Time Offer
                </Badge>
                
                <h2 className="text-4xl font-bold">
                  Ready to Transform Your Bounce House Business?
                </h2>
                
                <p className="text-xl text-white/90 leading-relaxed">
                  Join the growing community of bounce house businesses using InflateMate to streamline operations, increase bookings, and boost profits.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button size="lg" className="h-14 px-8 rounded-full bg-white text-blue-600 hover:text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Start Your 14-Day Free Trial
                  </Button>
                  <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-2 border-white/50 text-white hover:bg-white/10 hover:border-white transition-all duration-300">
                    Schedule a Demo <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 pt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-200" />
                    <span className="text-white/90">No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-200" />
                    <span className="text-white/90">Cancel anytime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-200" />
                    <span className="text-white/90">Full feature access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
