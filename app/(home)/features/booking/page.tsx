import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Shield,
  Smartphone,
  CreditCard,
  CheckCircle2,
  Layers,
  Globe,
  Repeat,
  Palette,
  Zap,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";



export default function BookingFeaturePage() {
  return (
    <div className="relative overflow-hidden pb-10">
      {/* Background Elements */}
      <div className="absolute top-60 -left-20 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl -z-10" />
      <div className="absolute bottom-40 right-0 w-72 h-72 bg-accent/10 rounded-full filter blur-3xl -z-10" />


      {/* Hero Section */}
      <section className="container px-4 md:px-6 py-12 md:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto text-center md:text-left">
          <Badge variant="outline" className="py-1.5 px-4 mb-6 border-primary/20 bg-primary/5 inline-flex items-center">
            <Calendar size={16} className="mr-1.5 text-primary" />
            <span className="text-primary font-medium">Online Booking System</span>
          </Badge>
          
          <h1 className="font-extrabold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
            Let Your Website Do The <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Booking</span> For You
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto md:mx-0">
            Say goodbye to endless phone calls and email chains. InflateMate&apos;s online booking system lets customers browse your inventory, check availability, and book directly from your website — 24/7.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Button size="lg" className="h-12 px-6">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6">
              Watch Demo <span className="ml-2 text-xs rounded-full bg-primary/10 text-primary px-2 py-0.5">2:14</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Feature Preview */}
      <section className="container px-4 md:px-6 py-8 md:py-16">
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-3 md:p-6 shadow-md relative overflow-hidden">
          {/* This would be an actual booking system screenshot or interactive demo */}
          <div className="aspect-video bg-white rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Calendar className="h-12 w-12 md:h-16 md:w-16 text-primary mx-auto mb-4 opacity-70" />
              <p className="text-muted-foreground">Interactive Booking System Preview</p>
            </div>
          </div>
          
          {/* Floating UI elements to create impression of a real interface */}
          <div className="absolute top-20 right-10 bg-white p-4 rounded-lg shadow-lg border border-border hidden md:block">
            <div className="flex items-center space-x-3 mb-3">
              <Calendar className="h-5 w-5 text-primary" />
              <p className="font-medium">Available Dates</p>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((day) => (
                <div 
                  key={day} 
                  className={`p-2 rounded-md text-sm ${
                    [2, 5, 8, 11].includes(day) 
                      ? 'bg-red-100 text-red-500 line-through' 
                      : 'bg-green-50 text-green-600 hover:bg-green-100 cursor-pointer'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
          
          <div className="absolute bottom-24 left-10 bg-white p-4 rounded-lg shadow-lg border border-border hidden md:block">
            <div className="flex items-center space-x-3 mb-3">
              <CreditCard className="h-5 w-5 text-primary" />
              <p className="font-medium">Secure Checkout</p>
            </div>
            <div className="space-y-2">
              <div className="h-8 bg-gray-100 rounded w-64"></div>
              <div className="h-8 bg-gray-100 rounded w-48"></div>
              <Button size="sm" className="w-full mt-2">Complete Booking</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="container px-4 md:px-6 py-16 md:py-24">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Benefits of Online Booking
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            See why bounce house rental companies are switching to InflateMate&apos;s booking system
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Benefit Cards */}
          <Card className="border-0 shadow-md h-full">
            <div className="h-2 bg-gradient-to-r from-primary to-primary/60"></div>
            <CardContent className="pt-6 px-6 pb-8">
              <Clock className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">24/7 Availability</h3>
              <p className="text-muted-foreground">
                Accept bookings at any time, even while you sleep. No more missing out on late-night inquiries or weekend booking opportunities.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md h-full">
            <div className="h-2 bg-gradient-to-r from-primary/70 to-primary/40"></div>
            <CardContent className="pt-6 px-6 pb-8">
              <Smartphone className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Mobile Optimized</h3>
              <p className="text-muted-foreground">
                Perfect for customers on the go. Our mobile-friendly design makes booking from phones and tablets simple and intuitive.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md h-full">
            <div className="h-2 bg-gradient-to-r from-primary/50 to-primary/30"></div>
            <CardContent className="pt-6 px-6 pb-8">
              <Layers className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">No Double Bookings</h3>
              <p className="text-muted-foreground">
                Real-time inventory management prevents scheduling conflicts and double bookings, saving you from awkward customer conversations.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md h-full">
            <div className="h-2 bg-gradient-to-r from-primary/60 to-primary/40"></div>
            <CardContent className="pt-6 px-6 pb-8">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Secure Deposits</h3>
              <p className="text-muted-foreground">
                Collect deposits or full payments securely via Stripe during booking, reducing no-shows and protecting your revenue.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md h-full">
            <div className="h-2 bg-gradient-to-r from-primary/50 to-primary/20"></div>
            <CardContent className="pt-6 px-6 pb-8">
              <Globe className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Custom Branding</h3>
              <p className="text-muted-foreground">
                Match your booking system to your company&apos;s colors and logo, creating a seamless experience for your customers.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md h-full">
            <div className="h-2 bg-gradient-to-r from-primary/40 to-primary/10"></div>
            <CardContent className="pt-6 px-6 pb-8">
              <Repeat className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Automated Follow-ups</h3>
              <p className="text-muted-foreground">
                Send automatic booking confirmations, reminders, and follow-up emails to encourage reviews and repeat business.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container px-4 md:px-6 py-16 relative">
        <div className="absolute top-0 left-1/2 bottom-0 border-l border-dashed border-muted -z-10 hidden md:block"></div>
        
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How Online Booking Works
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple for you, seamless for your customers
          </p>
        </div>
        
        <div className="space-y-12 md:space-y-24 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="md:text-right order-2 md:order-1">
              <div className="inline-flex items-center justify-center size-10 md:size-12 rounded-full bg-primary/10 text-primary font-bold mb-4">1</div>
              <h3 className="text-xl md:text-2xl font-bold mb-3">Customer Browses Inventory</h3>
              <p className="text-muted-foreground">
                Customers explore your bounce house collection with detailed photos, descriptions, and pricing. They can filter by type, size, theme, or event date.
              </p>
            </div>
            <div className="relative order-1 md:order-2">
              <div className="bg-gradient-to-br from-accent/10 to-primary/10 aspect-video rounded-xl p-4 flex items-center justify-center shadow-md">
                <div className="bg-white rounded-lg p-4 shadow-sm w-full">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-16 sm:h-28 bg-gray-100 rounded"></div>
                      <div className="h-16 sm:h-28 bg-gray-100 rounded"></div>
                      <div className="h-16 sm:h-28 bg-gray-100 rounded"></div>
                      <div className="h-16 sm:h-28 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 aspect-video rounded-xl p-4 flex items-center justify-center shadow-md">
                <div className="bg-white rounded-lg p-4 shadow-sm w-full">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array(21).fill(null).map((_, i) => (
                        <div key={i} className={`h-6 sm:h-8 rounded ${i % 3 === 0 ? 'bg-primary/20' : 'bg-gray-100'}`}></div>
                      ))}
                    </div>
                    <div className="h-8 bg-gray-100 rounded w-2/3 mt-4"></div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center justify-center size-10 md:size-12 rounded-full bg-primary/10 text-primary font-bold mb-4">2</div>
              <h3 className="text-xl md:text-2xl font-bold mb-3">Selects Date & Time</h3>
              <p className="text-muted-foreground">
                The interactive calendar shows real-time availability. Unavailable dates are clearly marked, and your custom buffer times are automatically applied.
              </p>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="md:text-right order-2 md:order-1">
              <div className="inline-flex items-center justify-center size-10 md:size-12 rounded-full bg-primary/10 text-primary font-bold mb-4">3</div>
              <h3 className="text-xl md:text-2xl font-bold mb-3">Submits Booking Details</h3>
              <p className="text-muted-foreground">
                Customers provide event details, delivery location, and special requests. Your customizable forms capture exactly the information you need.
              </p>
            </div>
            <div className="relative order-1 md:order-2">
              <div className="bg-gradient-to-br from-accent/10 to-primary/10 aspect-video rounded-xl p-4 flex items-center justify-center shadow-md">
                <div className="bg-white rounded-lg p-4 shadow-sm w-full">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-100 rounded"></div>
                    <div className="h-8 bg-gray-100 rounded"></div>
                    <div className="h-16 sm:h-20 bg-gray-100 rounded"></div>
                    <div className="h-8 bg-primary/20 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Step 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 aspect-video rounded-xl p-4 flex items-center justify-center shadow-md">
                <div className="bg-white rounded-lg p-4 shadow-sm w-full">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <div className="h-6 bg-gray-100 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                      <div className="h-4 bg-gray-100 rounded w-3/4 mt-1"></div>
                      <div className="h-10 bg-primary/20 rounded w-full mt-3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center justify-center size-10 md:size-12 rounded-full bg-primary/10 text-primary font-bold mb-4">4</div>
              <h3 className="text-xl md:text-2xl font-bold mb-3">Secures with Payment</h3>
              <p className="text-muted-foreground">
                Complete the booking with a deposit or full payment through our secure Stripe integration. You control the payment options and amounts.
              </p>
            </div>
          </div>
          
          {/* Step 5 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="md:text-right order-2 md:order-1">
              <div className="inline-flex items-center justify-center size-10 md:size-12 rounded-full bg-primary/10 text-primary font-bold mb-4">5</div>
              <h3 className="text-xl md:text-2xl font-bold mb-3">Automation Takes Over</h3>
              <p className="text-muted-foreground">
                The system automatically sends confirmation emails, digital waivers, and adds the booking to your calendar. No manual work required.
              </p>
            </div>
            <div className="relative order-1 md:order-2">
              <div className="bg-gradient-to-br from-accent/10 to-primary/10 aspect-video rounded-xl p-4 flex items-center justify-center shadow-md">
                <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
                  <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="size-5 sm:size-6 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                      </div>
                      <div className="h-2 sm:h-3 bg-gray-100 rounded ml-2 w-2/3"></div>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <div className="h-2 bg-gray-100 rounded"></div>
                      <div className="h-2 bg-gray-100 rounded"></div>
                      <div className="h-2 bg-gray-100 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="size-5 sm:size-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                      </div>
                      <div className="h-2 sm:h-3 bg-gray-100 rounded ml-2 w-2/3"></div>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <div className="h-2 bg-gray-100 rounded"></div>
                      <div className="h-2 bg-gray-100 rounded"></div>
                      <div className="h-2 bg-gray-100 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="size-5 sm:size-6 rounded-full bg-orange-100 flex items-center justify-center">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                      </div>
                      <div className="h-2 sm:h-3 bg-gray-100 rounded ml-2 w-2/3"></div>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <div className="h-2 bg-gray-100 rounded"></div>
                      <div className="h-2 bg-gray-100 rounded"></div>
                      <div className="h-2 bg-gray-100 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Details Section */}
      <section className="container px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-xs sm:max-w-md mx-auto mb-8 md:mb-12">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="customization">Customization</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
            </TabsList>
            
            <TabsContent value="features" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Core Booking Features</h3>
                  <ul className="space-y-3 md:space-y-4">
                    {[
                      "Real-time availability calendar",
                      "Automatic buffer time between bookings",
                      "Custom minimum notice periods",
                      "Delivery radius limitations by zip code",
                      "Seasonal pricing rules",
                      "Bundle discounts for multiple items",
                      "Required vs. optional add-ons",
                      "Custom booking questions",
                      "Automatic confirmation emails",
                      "Post-event feedback requests"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-primary mr-2 md:mr-3 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-8 md:mt-0">
                  <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Advanced Controls</h3>
                  <ul className="space-y-3 md:space-y-4">
                    {[
                      "Blackout dates for holidays or personal time",
                      "Early bird and last-minute discounts",
                      "Weather cancellation policies",
                      "Multi-day rental discounts",
                      "Automatic inventory blocking",
                      "Deposit amount controls (% or fixed)",
                      "Automatic delivery fee calculation",
                      "Custom cancellation policies",
                      "Booking approval workflow (auto or manual)",
                      "Delivery crew assignment"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-primary mr-2 md:mr-3 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="customization">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Make It Your Own</h3>
                  <p className="text-muted-foreground mb-6">
                    Your booking system should match your brand perfectly. Customize every aspect to create a seamless experience for your customers.
                  </p>
                  
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex">
                      <div className="flex-shrink-0 mt-1">
                        <Palette className="h-5 w-5 md:h-6 md:w-6 text-primary mr-3 md:mr-4" />
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">Custom Branding</h4>
                        <p className="text-muted-foreground">
                          Match your company colors, upload your logo, and customize fonts to create a cohesive brand experience.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 mt-1">
                        <Layers className="h-5 w-5 md:h-6 md:w-6 text-primary mr-3 md:mr-4" />
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">Flexible Form Fields</h4>
                        <p className="text-muted-foreground">
                          Create custom questions to gather exactly the information you need for successful events.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 mt-1">
                        <Globe className="h-5 w-5 md:h-6 md:w-6 text-primary mr-3 md:mr-4" />
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">Embed Options</h4>
                        <p className="text-muted-foreground">
                          Add your booking system to your existing website with simple embed codes, or use our hosted solution.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative mt-8 md:mt-0">
                  <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-4 md:p-6 rounded-xl shadow-md">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex space-x-2">
                          <div className="size-3 rounded-full bg-red-400"></div>
                          <div className="size-3 rounded-full bg-yellow-400"></div>
                          <div className="size-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="h-5 w-24 bg-gray-100 rounded"></div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between border-b border-gray-100 pb-4">
                          <div className="font-medium">Theme Color</div>
                          <div className="flex space-x-2">
                            <div className="size-5 sm:size-6 rounded-full bg-primary"></div>
                            <div className="size-5 sm:size-6 rounded-full bg-blue-500"></div>
                            <div className="size-5 sm:size-6 rounded-full bg-green-500"></div>
                            <div className="size-5 sm:size-6 rounded-full bg-red-500"></div>
                            <div className="size-5 sm:size-6 rounded-full bg-gray-500"></div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between border-b border-gray-100 pb-4">
                          <div className="font-medium">Logo</div>
                          <div className="h-6 w-16 bg-gray-100 rounded"></div>
                        </div>
                        
                        <div className="flex justify-between border-b border-gray-100 pb-4">
                          <div className="font-medium">Layout</div>
                          <div className="flex space-x-2">
                            <div className="h-6 w-6 border border-gray-200 rounded"></div>
                            <div className="h-6 w-6 border border-primary rounded bg-primary/10"></div>
                            <div className="h-6 w-6 border border-gray-200 rounded"></div>
                          </div>
                        </div>
                        
                        <div className="h-8 bg-primary/20 rounded w-full mt-3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="comparison">
              <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center">How Our Booking System Compares</h3>
              
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <table className="w-full min-w-[640px] sm:min-w-[800px] border-collapse">
                  <thead>
                    <tr>
                      <th className="p-3 md:p-4 text-left border-b border-border"></th>
                      <th className="p-3 md:p-4 text-left border-b border-border">
                        <div className="font-bold text-base md:text-lg">InflateMate</div>
                      </th>
                      <th className="p-3 md:p-4 text-left border-b border-border">
                        <div className="font-medium">Inflatable Office</div>
                      </th>
                      <th className="p-3 md:p-4 text-left border-b border-border">
                        <div className="font-medium">Generic Booking Tools</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 md:p-4 border-b border-border font-medium">Industry-Specific Features</td>
                      <td className="p-3 md:p-4 border-b border-border text-green-500">✓ Built for bounce houses</td>
                      <td className="p-3 md:p-4 border-b border-border text-green-500">✓ Industry focused</td>
                      <td className="p-3 md:p-4 border-b border-border text-rose-500">✗ Generic solution</td>
                    </tr>
                    <tr>
                      <td className="p-3 md:p-4 border-b border-border font-medium">Buffer Times Between Events</td>
                      <td className="p-3 md:p-4 border-b border-border text-green-500">✓ Fully customizable</td>
                      <td className="p-3 md:p-4 border-b border-border text-yellow-500">~ Limited options</td>
                      <td className="p-3 md:p-4 border-b border-border text-rose-500">✗ Not available</td>
                    </tr>
                    <tr>
                      <td className="p-3 md:p-4 border-b border-border font-medium">Delivery Radius Restrictions</td>
                      <td className="p-3 md:p-4 border-b border-border text-green-500">✓ By zip code or miles</td>
                      <td className="p-3 md:p-4 border-b border-border text-yellow-500">~ Manual only</td>
                      <td className="p-3 md:p-4 border-b border-border text-rose-500">✗ Not available</td>
                    </tr>
                    <tr>
                      <td className="p-3 md:p-4 border-b border-border font-medium">Visual Inventory Browsing</td>
                      <td className="p-3 md:p-4 border-b border-border text-green-500">✓ Gallery with filters</td>
                      <td className="p-3 md:p-4 border-b border-border text-yellow-500">~ Basic listings</td>
                      <td className="p-3 md:p-4 border-b border-border text-green-500">✓ Generic galleries</td>
                    </tr>
                    <tr>
                      <td className="p-3 md:p-4 border-b border-border font-medium">Mobile Experience</td>
                      <td className="p-3 md:p-4 border-b border-border text-green-500">✓ Fully responsive</td>
                      <td className="p-3 md:p-4 border-b border-border text-rose-500">✗ Poor mobile UX</td>
                      <td className="p-3 md:p-4 border-b border-border text-yellow-500">~ Varies by tool</td>
                    </tr>
                    <tr>
                      <td className="p-3 md:p-4 border-b border-border font-medium">Waiver Integration</td>
                      <td className="p-3 md:p-4 border-b border-border text-green-500">✓ Automatic sending</td>
                      <td className="p-3 md:p-4 border-b border-border text-yellow-500">~ Manual process</td>
                      <td className="p-3 md:p-4 border-b border-border text-rose-500">✗ Requires separate tool</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container px-4 md:px-6 py-16 relative">
        <div className="absolute -inset-x-20 top-1/3 h-52 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 blur-2xl -z-10" />
        
        <div className="text-center mb-12 md:mb-16">
          <Badge variant="outline" className="py-1.5 px-4 mb-6 border-primary/20 bg-primary/5 inline-flex items-center justify-center">
            <span className="text-primary font-medium">Customer Stories</span>
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            From Our Customers
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            See how the online booking system has helped other bounce house businesses
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-primary/5">
            <CardContent className="p-6 md:p-8">
              <div className="flex space-x-1 mb-6">
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
              <blockquote className="text-lg italic mb-6">
                &quot;Since implementing InflateMate&apos;s online booking system, our booking volume has increased by 35% and phone calls have decreased by 60%. The system practically runs itself!&quot;
              </blockquote>
              <div className="flex items-center">
                <div className="size-10 md:size-12 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <p className="font-medium">Jessica Williams</p>
                  <p className="text-sm text-muted-foreground">Bounce Party Rentals</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-accent/5">
            <CardContent className="p-6 md:p-8">
              <div className="flex space-x-1 mb-6">
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
              <blockquote className="text-lg italic mb-6">
                &quot;The automatic buffer times between bookings have eliminated our setup/teardown conflicts completely. No more rushing between events or keeping customers waiting.&quot;
              </blockquote>
              <div className="flex items-center">
                <div className="size-10 md:size-12 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <p className="font-medium">Michael Rodriguez</p>
                  <p className="text-sm text-muted-foreground">Jumpy Time Inflatables</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Common questions about our online booking system
            </p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-3 md:space-y-4">
            <AccordionItem value="item-1" className="border bg-card rounded-lg shadow-sm">
              <AccordionTrigger className="px-4 md:px-6 py-3 md:py-4">Can I still manually add bookings for phone inquiries?</AccordionTrigger>
              <AccordionContent className="px-4 md:px-6 pb-4">
                <p className="text-muted-foreground">
                  Yes! You can easily add manual bookings through your admin dashboard. These bookings will immediately sync with your availability calendar to prevent double-bookings.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border bg-card rounded-lg shadow-sm">
              <AccordionTrigger className="px-4 md:px-6 py-3 md:py-4">How do delivery zones work with online booking?</AccordionTrigger>
              <AccordionContent className="px-4 md:px-6 pb-4">
                <p className="text-muted-foreground">
                  You can set up multiple delivery zones by zip code or radius, each with its own pricing. Customers enter their zip code early in the booking process, and the system automatically calculates delivery fees or restricts booking if they&apos;re outside your service area.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border bg-card rounded-lg shadow-sm">
              <AccordionTrigger className="px-4 md:px-6 py-3 md:py-4">Can customers book multiple items at once?</AccordionTrigger>
              <AccordionContent className="px-4 md:px-6 pb-4">
                <p className="text-muted-foreground">
                  Absolutely! Customers can add multiple bounce houses, games, and accessories to their cart in a single booking. You can even create special bundle discounts for multiple items.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="border bg-card rounded-lg shadow-sm">
              <AccordionTrigger className="px-4 md:px-6 py-3 md:py-4">What payment options are available?</AccordionTrigger>
              <AccordionContent className="px-4 md:px-6 pb-4">
                <p className="text-muted-foreground">
                  InflateMate integrates with Stripe for secure payments. You can choose to collect a deposit (fixed amount or percentage) or full payment at booking. You can also offer options like &quot;Pay Later&quot; for trusted customers.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" className="border bg-card rounded-lg shadow-sm">
              <AccordionTrigger className="px-4 md:px-6 py-3 md:py-4">How much technical knowledge do I need to set this up?</AccordionTrigger>
              <AccordionContent className="px-4 md:px-6 pb-4">
                <p className="text-muted-foreground">
                  Very little! Our setup wizard guides you through the entire process. If you have your own website, we provide simple embed codes to add the booking system. If not, we create a complete booking website for you with your branding.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        
        <div className="container px-4 md:px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6">
              <div className="flex items-center justify-center p-2 px-4 rounded-full bg-background">
                <Zap size={16} className="text-primary mr-2" />
                <span className="text-sm font-medium">14-day free trial</span>
              </div>
            </div>
            
            <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6">
              Ready to Automate Your Booking Process?
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Join hundreds of bounce house rental companies who use InflateMate to streamline their bookings and grow their business.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="h-12 px-8">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8">
                Schedule Demo
              </Button>
            </div>
            
            <p className="mt-6 text-sm text-muted-foreground">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
