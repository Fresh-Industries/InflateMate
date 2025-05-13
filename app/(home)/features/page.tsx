import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  LayoutGrid,
  Users,
  Receipt,
  FileText,
  Palette,
  Megaphone,
  UserPlus,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// SEO metadata export
export const metadata = {
  title: "InflateMate Features | All-in-One Bounce House Rental Software",
  description:
    "Discover how InflateMate's online booking, inventory management, CRM, and marketing tools help bounce house rental businesses save time and increase bookings.",
  openGraph: {
    title: "InflateMate Features | Bounce House Rental Software",
    description: 
      "The all-in-one platform designed specifically for bounce house rental businesses. Simplify bookings, manage inventory, and grow your business.",
    images: [{ url: "/images/features-og.jpg" }],
  },
};

export default function FeaturesPage() {
  const featureIcons = {
    booking: <Calendar className="h-10 w-10 text-primary" />,
    inventory: <LayoutGrid className="h-10 w-10 text-primary" />,
    crm: <Users className="h-10 w-10 text-primary" />,
    invoicing: <Receipt className="h-10 w-10 text-primary" />,
    documents: <FileText className="h-10 w-10 text-primary" />,
    website: <Palette className="h-10 w-10 text-primary" />,
    marketing: <Megaphone className="h-10 w-10 text-primary" />,
    team: <UserPlus className="h-10 w-10 text-primary" />,
    sms: <MessageSquare className="h-10 w-10 text-primary" />,
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-40 left-0 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl -z-10" />
      <div className="absolute top-80 right-0 w-80 h-80 bg-accent/10 rounded-full filter blur-3xl -z-10" />
      <div className="absolute bottom-40 left-20 w-60 h-60 bg-primary/5 rounded-full animate-blob -z-10" />

      {/* Hero Section */}
      <section className="container px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="outline" className="py-1.5 px-4 mb-6 border-primary/20 bg-primary/5">
            <Zap size={16} className="mr-1.5 text-primary" />
            <span className="text-primary font-medium">Purpose-Built for Bounce House Businesses</span>
          </Badge>
          
          <h1 className="font-extrabold text-4xl md:text-6xl leading-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
            Every Feature You Need,<br />Nothing You Don&apos;t
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            InflateMate combines powerful booking tools, inventory management, and marketing features into one seamless platform — designed specifically for bounce house rental companies.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="h-12 px-6">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6">
              Schedule Demo
            </Button>
          </div>
        </div>

        {/* Feature Navigation */}
        <Tabs defaultValue="all" className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-12">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 p-1">
              <TabsTrigger value="all">All Features</TabsTrigger>
              <TabsTrigger value="bookings">Booking & Inventory</TabsTrigger>
              <TabsTrigger value="business">Business Management</TabsTrigger>
              <TabsTrigger value="growth">Growth Tools</TabsTrigger>
            </TabsList>
          </div>

          {/* All Features Tab */}
          <TabsContent value="all" className="space-y-24">
            {/* Booking System Feature */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <Badge variant="outline" className="mb-3 border-primary/20 bg-primary/5">
                  <span className="text-primary">Streamlined Booking</span>
                </Badge>
                <h2 className="text-3xl font-bold mb-4">Online Booking System</h2>
                <p className="text-muted-foreground mb-6">
                  Say goodbye to phone tag and double bookings. Let customers browse your inventory and book directly from your website — 24/7, on any device.
                </p>
                
                <ul className="space-y-3 mb-8">
                  {[
                    "Custom booking website with your branding",
                    "Smart scheduling with buffer times between events",
                    "Flexible rental windows and minimum notice periods",
                    "Automatic availability updates in real-time",
                    "Customer self-service booking portal"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href="/features/booking" className="text-primary font-medium inline-flex items-center group">
                  Learn more about online booking
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              <div className="relative order-1 lg:order-2">
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 aspect-video rounded-xl flex items-center justify-center">
                  {/* This would be an actual screenshot or illustration */}
                  <div className="text-center">
                    <Calendar className="h-16 w-16 text-primary mx-auto mb-4 opacity-70" />
                    <p className="text-muted-foreground">Booking System Screenshot</p>
                  </div>
                </div>
                <div className="absolute -bottom-5 -right-5 bg-background p-3 rounded-lg shadow-lg border border-border">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-lg font-bold">+</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">New Booking</p>
                      <p className="text-xs text-muted-foreground">Waterslide Party - $350</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Management Feature */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="bg-gradient-to-br from-accent/10 to-primary/10 aspect-video rounded-xl flex items-center justify-center">
                  {/* This would be an actual screenshot or illustration */}
                  <div className="text-center">
                    <LayoutGrid className="h-16 w-16 text-accent mx-auto mb-4 opacity-70" />
                    <p className="text-muted-foreground">Inventory Dashboard Screenshot</p>
                  </div>
                </div>
                <div className="absolute -bottom-5 -left-5 bg-background p-3 rounded-lg shadow-lg border border-border">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary text-lg font-bold">5</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Bookings Today</p>
                      <p className="text-xs text-muted-foreground">2 pending setup</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Badge variant="outline" className="mb-3 border-primary/20 bg-primary/5">
                  <span className="text-primary">Smart Management</span>
                </Badge>
                <h2 className="text-3xl font-bold mb-4">Inventory Management</h2>
                <p className="text-muted-foreground mb-6">
                  Keep track of all your bounce houses, waterslides, and games in one place. See what&apos;s booked, what&apos;s available, and which items are your top performers.
                </p>
                
                <ul className="space-y-3 mb-8">
                  {[
                    "Drag-and-drop image uploads for all your units",
                    "Tag items by type (combos, slides, games, etc.)",
                    "Track rental frequency and revenue per item",
                    "Maintenance scheduling and history logging",
                    "Powerful filtering and inventory reports"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href="/features/inventory" className="text-primary font-medium inline-flex items-center group">
                  Learn more about inventory management
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Features Grid for Other Features */}
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Everything You Need to Run Your Business</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  InflateMate brings all your tools into one platform, eliminating the need for multiple subscriptions and endless app-switching.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* CRM Feature Card */}
                <Card className="border border-border hover:border-primary/20 transition-colors overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="p-3 bg-primary/5 rounded-lg w-fit mb-4 group-hover:bg-primary/10 transition-colors">
                      {featureIcons.crm}
                    </div>
                    <h3 className="text-xl font-bold mb-2">Customer Relationship Management</h3>
                    <p className="text-muted-foreground mb-4">
                      Build lasting customer relationships with complete booking history, contact logs, and customer preferences all in one place.
                    </p>
                    <Link href="/features/crm" className="text-primary font-medium inline-flex items-center group">
                      Learn more
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </CardContent>
                </Card>

                {/* Invoicing Card */}
                <Card className="border border-border hover:border-primary/20 transition-colors overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="p-3 bg-primary/5 rounded-lg w-fit mb-4 group-hover:bg-primary/10 transition-colors">
                      {featureIcons.invoicing}
                    </div>
                    <h3 className="text-xl font-bold mb-2">Invoicing & Estimates</h3>
                    <p className="text-muted-foreground mb-4">
                      Create professional quotes and invoices in seconds. Accept payments directly through your Stripe account with no additional fees.
                    </p>
                    <Link href="/features/invoicing" className="text-primary font-medium inline-flex items-center group">
                      Learn more
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </CardContent>
                </Card>

                {/* Documents Card */}
                <Card className="border border-border hover:border-primary/20 transition-colors overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="p-3 bg-primary/5 rounded-lg w-fit mb-4 group-hover:bg-primary/10 transition-colors">
                      {featureIcons.documents}
                    </div>
                    <h3 className="text-xl font-bold mb-2">Automated Documents</h3>
                    <p className="text-muted-foreground mb-4">
                      Automatically send liability waivers, booking confirmations, and receipts to customers — timed perfectly in your booking flow.
                    </p>
                    <Link href="/features/documents" className="text-primary font-medium inline-flex items-center group">
                      Learn more
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </CardContent>
                </Card>

                {/* Website Builder Card */}
                <Card className="border border-border hover:border-primary/20 transition-colors overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="p-3 bg-primary/5 rounded-lg w-fit mb-4 group-hover:bg-primary/10 transition-colors">
                      {featureIcons.website}
                    </div>
                    <h3 className="text-xl font-bold mb-2">Website Builder</h3>
                    <p className="text-muted-foreground mb-4">
                      Get a professional booking website with your branding in minutes. Customize colors, layout, and content without any technical skills.
                    </p>
                    <Link href="/features/website" className="text-primary font-medium inline-flex items-center group">
                      Learn more
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </CardContent>
                </Card>

                {/* Marketing Tools Card */}
                <Card className="border border-border hover:border-primary/20 transition-colors overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="p-3 bg-primary/5 rounded-lg w-fit mb-4 group-hover:bg-primary/10 transition-colors">
                      {featureIcons.marketing}
                    </div>
                    <h3 className="text-xl font-bold mb-2">Marketing Tools</h3>
                    <p className="text-muted-foreground mb-4">
                      Create discount codes, capture leads with smart popups, and track your marketing performance — all from your dashboard.
                    </p>
                    <Link href="/features/marketing" className="text-primary font-medium inline-flex items-center group">
                      Learn more
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </CardContent>
                </Card>

                {/* Team Access Card */}
                <Card className="border border-border hover:border-primary/20 transition-colors overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="p-3 bg-primary/5 rounded-lg w-fit mb-4 group-hover:bg-primary/10 transition-colors">
                      {featureIcons.team}
                    </div>
                    <h3 className="text-xl font-bold mb-2">Team Management</h3>
                    <p className="text-muted-foreground mb-4">
                      Add up to 5 team members with customized permissions. Perfect for your delivery crew, office staff, or business partners.
                    </p>
                    <Link href="/features/team" className="text-primary font-medium inline-flex items-center group">
                      Learn more
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Coming Soon Feature */}
            <div className="relative bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 md:p-12">
              <div className="absolute -top-5 right-8 bg-background border border-primary/20 text-primary font-medium px-4 py-1 rounded-full text-sm">
                Coming Soon
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  {featureIcons.sms}
                  <h2 className="text-3xl font-bold my-4">SMS Notifications</h2>
                  <p className="text-muted-foreground mb-6">
                    Two-way text messaging is coming to InflateMate! Send delivery updates, payment reminders, and day-of instructions. Allow customers to reply directly for the most convenient communication.
                  </p>
                  
                  <Button variant="outline" className="group">
                    Join the waitlist
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-background p-4 rounded-lg shadow-sm border border-border ml-auto w-3/4">
                    <p className="text-sm font-medium">Bounce House Business</p>
                    <p className="text-sm">Your bounce house is confirmed for Saturday! We&apos;ll arrive for setup between 9-10 AM. Reply with any questions.</p>
                    <p className="text-xs text-muted-foreground mt-1">10:24 AM</p>
                  </div>
                  
                  <div className="bg-primary/10 p-4 rounded-lg shadow-sm border border-primary/20 w-3/4">
                    <p className="text-sm">Great, thank you! Will you need access to an outlet for the blower?</p>
                    <p className="text-xs text-muted-foreground mt-1">10:32 AM</p>
                  </div>
                  
                  <div className="bg-background p-4 rounded-lg shadow-sm border border-border ml-auto w-3/4">
                    <p className="text-sm font-medium">Bounce House Business</p>
                    <p className="text-sm">Yes, we&apos;ll need an outlet within 50 feet of the setup location. See you Saturday!</p>
                    <p className="text-xs text-muted-foreground mt-1">10:38 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Additional tab contents would go here for the other tabs */}
          <TabsContent value="bookings">
            {/* Similar structure to the "all" tab but filtered for booking-related features */}
            <div className="p-12 text-center text-muted-foreground">
              Booking & Inventory features content would go here
            </div>
          </TabsContent>
          
          <TabsContent value="business">
            <div className="p-12 text-center text-muted-foreground">
              Business Management features content would go here
            </div>
          </TabsContent>
          
          <TabsContent value="growth">
            <div className="p-12 text-center text-muted-foreground">
              Growth Tools features content would go here
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Comparison Section */}
      <section className="container px-4 py-16 relative">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How InflateMate Compares</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See why bounce house business owners are switching from outdated software to InflateMate.
          </p>
        </div>
        
        <div className="overflow-x-auto pb-6">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left border-b border-border"></th>
                <th className="p-4 text-left border-b border-border">
                  <div className="font-bold text-lg">InflateMate</div>
                  <div className="text-sm text-muted-foreground">Modern & purpose-built</div>
                </th>
                <th className="p-4 text-left border-b border-border">
                  <div className="font-medium">Inflatable Office</div>
                  <div className="text-sm text-muted-foreground">Legacy software</div>
                </th>
                <th className="p-4 text-left border-b border-border">
                  <div className="font-medium">Goodshuffle Pro</div>
                  <div className="text-sm text-muted-foreground">General event rentals</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border-b border-border font-medium">Modern User Interface</td>
                <td className="p-4 border-b border-border text-green-500">✓ Clean, intuitive design</td>
                <td className="p-4 border-b border-border text-rose-500">✗ Outdated interface</td>
                <td className="p-4 border-b border-border text-yellow-500">~ Somewhat modern</td>
              </tr>
              <tr>
                <td className="p-4 border-b border-border font-medium">Bounce House Specific</td>
                <td className="p-4 border-b border-border text-green-500">✓ Built specifically for the industry</td>
                <td className="p-4 border-b border-border text-green-500">✓ Industry focused</td>
                <td className="p-4 border-b border-border text-rose-500">✗ General rental software</td>
              </tr>
              <tr>
                <td className="p-4 border-b border-border font-medium">Custom Website</td>
                <td className="p-4 border-b border-border text-green-500">✓ Included in all plans</td>
                <td className="p-4 border-b border-border text-yellow-500">~ Basic web store only</td>
                <td className="p-4 border-b border-border text-green-500">✓ Included</td>
              </tr>
              <tr>
                <td className="p-4 border-b border-border font-medium">Customer Support</td>
                <td className="p-4 border-b border-border text-green-500">✓ Live chat & same-day email</td>
                <td className="p-4 border-b border-border text-yellow-500">~ Email only</td>
                <td className="p-4 border-b border-border text-green-500">✓ Email & phone</td>
              </tr>
              <tr>
                <td className="p-4 border-b border-border font-medium">Pricing Structure</td>
                <td className="p-4 border-b border-border text-green-500">✓ Simple, all-inclusive</td>
                <td className="p-4 border-b border-border text-rose-500">✗ Complex add-ons</td>
                <td className="p-4 border-b border-border text-yellow-500">~ Tiered with extras</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="text-center mt-8">
          <Link href="/compare/inflatable-office" className="text-primary font-medium inline-flex items-center group">
            See detailed comparison
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="outline" className="py-1.5 px-4 mb-6 border-primary/20 bg-primary/5">
            <span className="text-primary font-medium">Success Stories</span>
          </Badge>
          <h2 className="font-extrabold text-3xl md:text-5xl leading-tight mb-6">
            Trusted by Bounce House Businesses Nationwide
          </h2>
          <p className="text-xl text-muted-foreground">
            Join hundreds of bounce house rental companies who use InflateMate to streamline their operations and grow their business.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial cards would go here */}
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-0 shadow-md">
              <CardContent className="p-8">
                <div className="flex space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-lg mb-6">
                  &quot;InflateMate completely transformed how we manage our bounce house business. 
                Bookings are up 30% and we&apos;ve cut admin time in half!&quot;
                </blockquote>
                <div className="flex items-center">
                  <div className="size-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <p className="font-medium">John Smith</p>
                    <p className="text-sm text-muted-foreground">Bounce Around LLC</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary/10 to-accent/10 py-16 md:py-24">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-bold text-3xl md:text-4xl mb-6">
              Ready to Streamline Your Bounce House Business?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join hundreds of bounce house rental companies who trust InflateMate.
              Start your 14-day free trial today — no credit card required.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="h-12 px-8">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8">
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
