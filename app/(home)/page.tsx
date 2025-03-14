import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  CalendarCheck, 
  BarChart, 
  Users, 
  CreditCard, 
  Smartphone, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  Clock, 
  Sparkles,
  PartyPopper
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      {/* Floating Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-24 h-24 rounded-full bg-blue-200 opacity-30 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 rounded-full bg-purple-200 opacity-30 animate-float-delayed"></div>
        <div className="absolute top-96 left-1/4 w-32 h-32 rounded-full bg-pink-200 opacity-20 animate-float"></div>
        <div className="absolute top-[30rem] right-1/3 w-20 h-20 rounded-full bg-yellow-200 opacity-30 animate-float-delayed"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden bg-gradient-to-b from-white via-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-1.5 text-sm rounded-full">
                #1 Bounce House Management Software
              </Badge>
              
              <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
                Bounce Your Business to 
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"> New Heights!</span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-xl mx-auto lg:mx-0">
                The all-in-one platform that helps bounce house rental businesses 
                <span className="font-semibold text-blue-600"> inflate their profits</span> and 
                <span className="font-semibold text-purple-600"> bounce past the competition!</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="h-14 px-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all">
                  Start Your Free Trial
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-blue-400 text-blue-600 hover:bg-blue-50">
                  Watch Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-bold text-blue-600">500+</span> bounce businesses trust us!
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="relative w-full h-[400px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 z-10 rounded-3xl"></div>
                <Image 
                  src="/images/hero-dashboard.png" 
                  alt="InflateMate Dashboard" 
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-lg p-4 z-20 transform rotate-6 animate-float">
                <div className="flex items-center gap-3">
                  <CalendarCheck className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm font-bold">New Booking!</p>
                    <p className="text-xs text-gray-500">Princess Party - $350</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 z-20 transform -rotate-3 animate-float-delayed">
                <div className="flex items-center gap-3">
                  <BarChart className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm font-bold">Revenue Up!</p>
                    <p className="text-xs text-gray-500">+27% this month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500 mb-8">TRUSTED BY BOUNCE HOUSE BUSINESSES NATIONWIDE</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {['BounceKings', 'JumpMasters', 'InflateFun', 'PartyBounce', 'AirCastle'].map((company) => (
              <div key={company} className="text-xl font-bold text-gray-400 hover:text-blue-500 transition-colors">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white via-blue-50 to-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-1.5 text-sm rounded-full mb-4">
              Bounce-tastic Features
            </Badge>
            <h2 className="text-4xl font-bold mb-6">
              Everything You Need to <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Inflate Your Success</span>
            </h2>
            <p className="text-xl text-gray-600">
              Our all-in-one platform is designed specifically for bounce house rental businesses to streamline operations and boost profits.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <CalendarCheck className="h-10 w-10 text-blue-500" />,
                title: "Smart Booking System",
                description: "Effortlessly manage reservations, prevent double-bookings, and send automated confirmations."
              },
              {
                icon: <Users className="h-10 w-10 text-purple-500" />,
                title: "Customer Management",
                description: "Build lasting relationships with detailed customer profiles and booking history."
              },
              {
                icon: <CreditCard className="h-10 w-10 text-pink-500" />,
                title: "Seamless Payments",
                description: "Accept deposits and full payments online with our secure Stripe integration."
              },
              {
                icon: <Smartphone className="h-10 w-10 text-indigo-500" />,
                title: "Custom Website Builder",
                description: "Create a stunning website for your bounce house business in minutes, no coding required."
              },
              {
                icon: <BarChart className="h-10 w-10 text-green-500" />,
                title: "Powerful Analytics",
                description: "Gain insights into your most popular items, peak booking times, and revenue trends."
              },
              {
                icon: <Zap className="h-10 w-10 text-yellow-500" />,
                title: "Automated Marketing",
                description: "Send targeted promotions, follow-ups, and special offers to boost repeat bookings."
              }
            ].map((feature, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all rounded-xl overflow-hidden group">
                <CardHeader className="pb-2">
                  <div className="bg-blue-50 group-hover:bg-blue-100 transition-colors w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="p-0 text-blue-600 hover:text-blue-700 group-hover:translate-x-1 transition-transform">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-1.5 text-sm rounded-full mb-4">
              Simple Process
            </Badge>
            <h2 className="text-4xl font-bold mb-6">
              How InflateMate <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Elevates Your Business</span>
            </h2>
            <p className="text-xl text-gray-600">
              Get up and running in minutes with our easy setup process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-blue-100 -translate-y-1/2 z-0"></div>
            
            {[
              {
                step: 1,
                title: "Sign Up & Setup",
                description: "Create your account, add your bounce house inventory, and customize your settings.",
                icon: <PartyPopper className="h-8 w-8 text-white" />
              },
              {
                step: 2,
                title: "Connect & Customize",
                description: "Link your payment processor, set up your booking rules, and design your customer portal.",
                icon: <Sparkles className="h-8 w-8 text-white" />
              },
              {
                step: 3,
                title: "Start Growing",
                description: "Accept bookings, manage your calendar, and watch your business bounce to new heights!",
                icon: <Star className="h-8 w-8 text-white" />
              }
            ].map((step, index) => (
              <div key={index} className="relative z-10 flex flex-col items-center">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-6">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600 text-center">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-white via-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-1.5 text-sm rounded-full mb-4">
              Success Stories
            </Badge>
            <h2 className="text-4xl font-bold mb-6">
              Loved by Bounce House <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Business Owners</span>
            </h2>
            <p className="text-xl text-gray-600">
              See how InflateMate has helped bounce house businesses across the country
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                business: "Bounce-A-Lot Rentals",
                image: "/images/testimonial1.jpg",
                quote: "Since using InflateMate, my bookings have increased by 40% and I've saved 15 hours a week on administrative tasks!",
                stars: 5
              },
              {
                name: "Michael Rodriguez",
                business: "Jump City Inflatables",
                image: "/images/testimonial2.jpg",
                quote: "The customer management system is a game-changer. My repeat bookings are up 35% thanks to the automated follow-ups.",
                stars: 5
              },
              {
                name: "Jennifer Williams",
                business: "Party Bounce Co.",
                image: "/images/testimonial3.jpg",
                quote: "I was skeptical at first, but InflateMate paid for itself in the first month. Best business decision I've made!",
                stars: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all rounded-xl overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.business}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex mb-3">
                    {Array(testimonial.stars).fill(0).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-1.5 text-sm rounded-full mb-4">
              Simple Pricing
            </Badge>
            <h2 className="text-4xl font-bold mb-6">
              Plans That <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Grow With Your Business</span>
            </h2>
            <p className="text-xl text-gray-600">
              No hidden fees, no complicated tiers. Just straightforward pricing to help your business bounce higher.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-all rounded-xl overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold text-blue-600">Starter Bounce</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">$100</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <CardDescription>Perfect for new bounce house businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Up to 10 bounce houses/inflatables",
                    "Online booking system",
                    "Customer management",
                    "Payment processing",
                    "Basic reporting",
                    "Email support"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                  Start Free Trial
                </Button>
              </CardFooter>
            </Card>
            
            {/* Pro Plan */}
            <Card className="border-2 border-blue-500 shadow-xl hover:shadow-2xl transition-all rounded-xl overflow-hidden relative scale-105">
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-medium">
                MOST POPULAR
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold text-blue-600">Pro Bounce</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">$200</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <CardDescription>For growing bounce house businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Unlimited bounce houses/inflatables",
                    "Advanced booking system",
                    "Customer management & CRM",
                    "Payment processing",
                    "Detailed analytics",
                    "Custom website builder",
                    "Email & SMS notifications",
                    "Priority support"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  Start Free Trial
                </Button>
              </CardFooter>
            </Card>
            
            {/* Enterprise Plan */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-all rounded-xl overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold text-blue-600">Business Bounce</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">$350</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <CardDescription>For established bounce house businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Everything in Pro Bounce",
                    "Multiple locations support",
                    "Staff management",
                    "Advanced inventory tracking",
                    "Custom integrations",
                    "White-label option",
                    "Dedicated account manager",
                    "24/7 priority support"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full rounded-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
                  Contact Sales
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-white via-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-1.5 text-sm rounded-full mb-4">
              Common Questions
            </Badge>
            <h2 className="text-4xl font-bold mb-6">
              Frequently Asked <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-xl text-gray-600">
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
                answer: "Yes! InflateMate integrates seamlessly with Stripe to allow you to accept deposits and full payments online, making the booking process smooth for both you and your customers."
              },
              {
                question: "Is there a limit to how many bounce houses I can manage?",
                answer: "The Starter plan allows up to 10 inflatables, while the Pro and Business plans offer unlimited inventory management to grow with your business."
              },
              {
                question: "Can I customize my booking rules?",
                answer: "Absolutely! Set your own buffer times between bookings, minimum notice periods, deposit requirements, and more to match your business operations."
              },
              {
                question: "What kind of support do you offer?",
                answer: "All plans include email support. Pro plans include priority support with faster response times, while Business plans include 24/7 support and a dedicated account manager."
              }
            ].map((faq, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all rounded-xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">{faq.question}</CardTitle>
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 text-white text-center relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white opacity-10"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-white opacity-10"></div>
            </div>
            
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl font-bold">Ready to Bounce Higher?</h2>
              <p className="text-xl max-w-2xl mx-auto">
                Join hundreds of successful bounce house businesses using InflateMate to streamline operations, increase bookings, and boost profits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="h-14 px-8 rounded-full bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all">
                  Start Your 14-Day Free Trial
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-white text-white hover:bg-white/10">
                  Schedule a Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm opacity-80">No credit card required. Cancel anytime.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
