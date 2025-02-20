import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating, bouncing circles */}
        <div className="absolute bg-[#89CFF0] rounded-full w-16 h-16 top-10 left-20 animate-bounce" />
        <div className="absolute bg-[#5DADE2] rounded-full w-12 h-12 top-1/2 right-10 animate-bounce delay-200" />
        <div className="absolute bg-[#B3E5FC] rounded-full w-20 h-20 bottom-20 left-1/3 animate-bounce delay-300" />
        <div className="absolute bg-[#89CFF0] rounded-full w-10 h-10 bottom-10 right-20 animate-bounce delay-400" />
      </div>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 py-20 text-center bg-gradient-to-br from-[#89CFF0] to-white">
        <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-snug">
            Bounce House <span className="text-[#5DADE2]">SaaS</span> that <br />
            Takes Your Party to New Heights!
          </h1>
          <p className="text-xl sm:text-2xl text-gray-800 max-w-2xl mx-auto">
            Supercharge your bounce house business with our all-in-one platform for bookings,
            inventory management, CRM, and more. Get ready to elevate every event!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              size="lg"
              className="w-full sm:w-auto h-14 px-8 bg-[#89CFF0] hover:bg-[#5DADE2] transition-colors"
            >
              Get Started Now! 🚀
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-14 px-8 border-2 border-[#89CFF0] hover:bg-[#E3F2FD] transition-colors"
            >
              Discover the Magic! ✨
            </Button>
          </div>
        </div>
        
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-4 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#5DADE2]">
            Features that Bounce Beyond
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="transition-transform duration-300 hover:scale-105 hover:shadow-xl border border-[#E3F2FD]">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-[#E3F2FD] flex items-center justify-center mb-4 animate-bounce">
                  <span className="text-2xl">📅</span>
                </div>
                <CardTitle className="text-xl text-[#5DADE2]">Seamless Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Streamline your reservations with an intuitive system built for busy bounce house pros.
                </p>
              </CardContent>
            </Card>

            <Card className="transition-transform duration-300 hover:scale-105 hover:shadow-xl border border-[#E3F2FD]">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-[#E3F2FD] flex items-center justify-center mb-4 animate-bounce">
                  <span className="text-2xl">📦</span>
                </div>
                <CardTitle className="text-xl text-[#5DADE2]">Smart Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Keep track of your assets with ease and never miss a booking due to low inventory.
                </p>
              </CardContent>
            </Card>

            <Card className="transition-transform duration-300 hover:scale-105 hover:shadow-xl border border-[#E3F2FD]">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-[#E3F2FD] flex items-center justify-center mb-4 animate-bounce">
                  <span className="text-2xl">🤝</span>
                </div>
                <CardTitle className="text-xl text-[#5DADE2]">Customer CRM</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Build lasting relationships with a CRM designed specifically for the bounce house industry.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 px-4 py-20 bg-gradient-to-br from-white to-[#E3F2FD]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#5DADE2]">
            Bouncing with Joy! 🎈
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial Cards */}
            <Card className="transform hover:rotate-2 transition-all duration-300 border-2 border-[#89CFF0]">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#5DADE2] flex items-center justify-center">
                    <span className="text-white font-bold">JD</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">John Doe</CardTitle>
                    <p className="text-sm text-gray-600">Party Pro</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="italic text-gray-700">"InflateMate transformed how I run my bounce house business. The booking system is a game-changer!"</p>
              </CardContent>
            </Card>

            <Card className="transform hover:rotate-2 transition-all duration-300 border-2 border-[#89CFF0] md:translate-y-4">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#5DADE2] flex items-center justify-center">
                    <span className="text-white font-bold">SJ</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">Sarah Johnson</CardTitle>
                    <p className="text-sm text-gray-600">Event Manager</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="italic text-gray-700">"The inventory management system has saved me countless hours. Simply amazing!"</p>
              </CardContent>
            </Card>

            <Card className="transform hover:rotate-2 transition-all duration-300 border-2 border-[#89CFF0]">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#5DADE2] flex items-center justify-center">
                    <span className="text-white font-bold">MP</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">Mike Peterson</CardTitle>
                    <p className="text-sm text-gray-600">Business Owner</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="italic text-gray-700">"My revenue doubled within 3 months of using InflateMate. Best investment ever!"</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 px-4 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#5DADE2]">
            Simple Pricing, Incredible Value 🎯
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <Card className="transform hover:-translate-y-2 transition-all duration-300 border-2 border-[#E3F2FD]">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-[#5DADE2]">Starter</CardTitle>
                <div className="text-center">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Basic Booking System
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Simple Inventory Management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Email Support
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-[#89CFF0] hover:bg-[#5DADE2]">
                  Start Bouncing
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="transform hover:-translate-y-2 transition-all duration-300 border-2 border-[#5DADE2] shadow-xl">
              <CardHeader>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#5DADE2] text-white px-4 py-1 rounded-full text-sm">
                  Most Popular
                </div>
                <CardTitle className="text-2xl text-center text-[#5DADE2]">Pro</CardTitle>
                <div className="text-center">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Advanced Booking System
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Full Inventory Management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Priority Support
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    CRM Features
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-[#5DADE2] hover:bg-[#4A90E2]">
                  Go Pro
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="transform hover:-translate-y-2 transition-all duration-300 border-2 border-[#E3F2FD]">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-[#5DADE2]">Enterprise</CardTitle>
                <div className="text-center">
                  <span className="text-4xl font-bold">$199</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Everything in Pro
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Custom Integration
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    24/7 Support
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    White Label Option
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-[#89CFF0] hover:bg-[#5DADE2]">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="relative flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-r from-[#E3F2FD] to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#5DADE2]">
            Ready to Skyrocket Your Bounce Business?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Join the ranks of successful bounce house operators who have transformed their business with our innovative SaaS.
          </p>
          <Button
            size="lg"
            className="w-full sm:w-auto h-14 px-8 bg-[#89CFF0] hover:bg-[#5DADE2] transition-colors"
          >
            Let's Bounce! 🎈
          </Button>
        </div>
      </section>

     
    </main>
  );
}
