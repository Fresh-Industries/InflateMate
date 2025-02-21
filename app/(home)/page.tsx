import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-white">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bg-blue-100 rounded-full w-20 h-20 top-16 left-16 opacity-50 animate-pulse" />
        <div className="absolute bg-blue-200 rounded-full w-16 h-16 top-1/3 right-20 opacity-50 animate-pulse delay-150" />
      </div>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 py-20 text-center bg-gradient-to-br from-gray-50 to-white">
        <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
            Bounce House <span className="text-blue-500">SaaS</span> That <br />
            Elevates Every Celebration
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600">
            Streamline your bounce house business with seamless bookings, smart inventory, and powerful CRM.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              size="lg"
              className="w-full sm:w-auto h-14 px-8 bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-14 px-8 border border-blue-500 text-blue-500 hover:bg-blue-50 transition-colors"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-4 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-blue-500">
            Elegant Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <Card className="transition-transform duration-300 hover:scale-105 hover:shadow-xl border border-gray-200 rounded-xl">
              <CardHeader className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <span className="text-3xl">📅</span>
                </div>
                <CardTitle className="text-xl text-blue-500">Seamless Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Intuitive booking system designed for busy bounce house professionals.
                </p>
              </CardContent>
            </Card>

            <Card className="transition-transform duration-300 hover:scale-105 hover:shadow-xl border border-gray-200 rounded-xl">
              <CardHeader className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <span className="text-3xl">📦</span>
                </div>
                <CardTitle className="text-xl text-blue-500">Smart Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Manage your assets effortlessly to never miss a booking.
                </p>
              </CardContent>
            </Card>

            <Card className="transition-transform duration-300 hover:scale-105 hover:shadow-xl border border-gray-200 rounded-xl">
              <CardHeader className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <span className="text-3xl">🤝</span>
                </div>
                <CardTitle className="text-xl text-blue-500">Customer CRM</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Enhance relationships with a CRM tailored for bounce house operators.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 px-4 py-20 bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-blue-500">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <Card className="transition-transform duration-300 hover:scale-105 border border-gray-200 rounded-xl">
              <CardHeader className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold">JD</span>
                </div>
                <div>
                  <CardTitle className="text-lg">John Doe</CardTitle>
                  <p className="text-sm text-gray-500">Party Pro</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="italic text-gray-700">
                  &ldquo;InflateMate transformed my business. The booking system is a game-changer!&rdquo;
                </p>
              </CardContent>
            </Card>

            <Card className="transition-transform duration-300 hover:scale-105 border border-gray-200 rounded-xl">
              <CardHeader className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold">SJ</span>
                </div>
                <div>
                  <CardTitle className="text-lg">Sarah Johnson</CardTitle>
                  <p className="text-sm text-gray-500">Event Manager</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="italic text-gray-700">
                  &ldquo;The inventory management system saved me hours. Simply amazing!&rdquo;
                </p>
              </CardContent>
            </Card>

            <Card className="transition-transform duration-300 hover:scale-105 border border-gray-200 rounded-xl">
              <CardHeader className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold">MP</span>
                </div>
                <div>
                  <CardTitle className="text-lg">Mike Peterson</CardTitle>
                  <p className="text-sm text-gray-500">Business Owner</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="italic text-gray-700">
                  &ldquo;My revenue doubled within 3 months of using InflateMate. Best investment ever!&rdquo;
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 px-4 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-blue-500">
            Transparent Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Card className="transition-transform duration-300 hover:scale-105 border border-gray-200 rounded-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-blue-500">Starter</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600 text-center">
                  <li className="flex items-center justify-center gap-2">
                    <span className="text-green-500">✓</span> Basic Booking
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <span className="text-green-500">✓</span> Inventory Management
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <span className="text-green-500">✓</span> Email Support
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                  Start Now
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-transform duration-300 hover:scale-105 border border-blue-500 shadow-xl rounded-xl relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                Most Popular
              </div>
              <CardHeader className="text-center mt-4">
                <CardTitle className="text-2xl text-blue-500">Pro</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600 text-center">
                  <li className="flex items-center justify-center gap-2">
                    <span className="text-green-500">✓</span> Advanced Booking
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <span className="text-green-500">✓</span> Full Inventory
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <span className="text-green-500">✓</span> Priority Support
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <span className="text-green-500">✓</span> CRM Features
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  Go Pro
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-transform duration-300 hover:scale-105 border border-gray-200 rounded-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-blue-500">Enterprise</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">$199</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600 text-center">
                  <li className="flex items-center justify-center gap-2">
                    <span className="text-green-500">✓</span> Everything in Pro
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <span className="text-green-500">✓</span> Custom Integration
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <span className="text-green-500">✓</span> 24/7 Support
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <span className="text-green-500">✓</span> White Label Option
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="relative flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-r from-blue-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-blue-500">
            Ready to Elevate Your Bounce Business?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Join a community of successful bounce house operators who are transforming their events.
          </p>
          <Button
            size="lg"
            className="w-full sm:w-auto h-14 px-8 bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md"
          >
            Let&apos;s Get Started
          </Button>
        </div>
      </section>
    </main>
  );
}
