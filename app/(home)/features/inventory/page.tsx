import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  PieChart,
  Tag,
  Camera,
  ArrowUpDown,
  Clock,
  Search,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Zap,
  FileText,
  BarChart3,
  Calendar,
  PenTool
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

// SEO metadata export
export const metadata = {
  title: "Inventory Management | InflateMate Bounce House Rental Software",
  description:
    "Streamline your bounce house rental business with InflateMate's inventory management system. Track your inflatables, manage maintenance, and analyze performance.",
  openGraph: {
    title: "Inventory Management for Bounce House Rentals | InflateMate",
    description: 
      "Take control of your bounce house inventory. Track usage, manage maintenance, and identify your most profitable units with InflateMate's inventory system.",
    images: [{ url: "/images/inventory-management-og.jpg" }],
  },
};

export default function InventoryManagementPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-60 -right-20 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl -z-10" />
      <div className="absolute bottom-40 left-0 w-72 h-72 bg-accent/10 rounded-full filter blur-3xl -z-10" />

      {/* Back to Features Navigation */}
      <div className="container px-4 pt-8">
        <Link 
          href="/features" 
          className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to all features
        </Link>
      </div>

      {/* Hero Section */}
      <section className="container px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <Badge variant="outline" className="py-1.5 px-4 mb-6 border-primary/20 bg-primary/5">
            <LayoutGrid size={16} className="mr-1.5 text-primary" />
            <span className="text-primary font-medium">Inventory Management</span>
          </Badge>
          
          <h1 className="font-extrabold text-4xl md:text-6xl leading-tight mb-6">
            Know <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Exactly</span> What You Have & Where It Is
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
            Keep track of all your bounce houses, waterslides, and games in one place. See what&apos;s booked, what&apos;s available, and which items are making you the most money.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="h-12 px-6">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6">
              Watch Demo <span className="ml-2 text-xs rounded-full bg-primary/10 text-primary px-2 py-0.5">1:48</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Feature Preview */}
      <section className="container px-4 py-8 md:py-16">
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-3 md:p-6 shadow-md relative overflow-hidden">
          {/* This would be an actual inventory dashboard screenshot */}
          <div className="aspect-video bg-white rounded-lg flex items-center justify-center">
            <div className="text-center">
              <LayoutGrid className="h-16 w-16 text-primary mx-auto mb-4 opacity-70" />
              <p className="text-muted-foreground">Interactive Inventory Dashboard Preview</p>
            </div>
          </div>
          
          {/* Floating UI elements to create impression of a real interface */}
          <div className="absolute top-20 right-10 bg-white p-4 rounded-lg shadow-lg border border-border hidden md:block">
            <div className="flex items-center space-x-3 mb-3">
              <PieChart className="h-5 w-5 text-primary" />
              <p className="font-medium">Item Performance</p>
            </div>
            <div className="w-64 h-32 bg-gray-50 rounded-md relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-8 border-primary/30">
                  <div className="w-full h-full rounded-full border-8 border-t-primary border-r-primary border-b-transparent border-l-transparent transform rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-24 left-10 bg-white p-4 rounded-lg shadow-lg border border-border hidden md:block">
            <div className="flex items-center space-x-3 mb-3">
              <Tag className="h-5 w-5 text-primary" />
              <p className="font-medium">Inventory Status</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Available</span>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">8</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Booked Today</span>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">5</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Maintenance</span>
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">2</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="container px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Benefits of Smart Inventory Management
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stop using spreadsheets and start using a system built for bounce house businesses
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Benefit Cards */}
          <Card className="border-0 shadow-md">
            <div className="h-2 bg-gradient-to-r from-primary to-primary/60"></div>
            <CardContent className="pt-6 px-6 pb-8">
              <ArrowUpDown className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Track Utilization</h3>
              <p className="text-muted-foreground">
                See which inflatables are your top performers and which ones are sitting in storage. Make data-driven decisions about your inventory.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md">
            <div className="h-2 bg-gradient-to-r from-primary/70 to-primary/40"></div>
            <CardContent className="pt-6 px-6 pb-8">
              <AlertTriangle className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Prevent Overbooking</h3>
              <p className="text-muted-foreground">
                Automatic availability updates mean you&apos;ll never double-book an inflatable again. Say goodbye to those emergency phone calls.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md">
            <div className="h-2 bg-gradient-to-r from-primary/50 to-primary/30"></div>
            <CardContent className="pt-6 px-6 pb-8">
            <PenTool className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Maintenance Tracking</h3>
              <p className="text-muted-foreground">
                Schedule and track maintenance for all your units. Get reminders when inspections are due and log repair history.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md">
            <div className="h-2 bg-gradient-to-r from-primary/60 to-primary/40"></div>
            <CardContent className="pt-6 px-6 pb-8">
              <Search className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Quick Search & Filters</h3>
              <p className="text-muted-foreground">
                Find exactly what you need with powerful filtering. Search by type, size, theme, or age range to quickly locate items.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md">
            <div className="h-2 bg-gradient-to-r from-primary/50 to-primary/20"></div>
            <CardContent className="pt-6 px-6 pb-8">
              <Camera className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Visual Management</h3>
              <p className="text-muted-foreground">
                Upload multiple photos of each item to show different angles. Help your crew identify exactly which unit to load.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md">
            <div className="h-2 bg-gradient-to-r from-primary/40 to-primary/10"></div>
            <CardContent className="pt-6 px-6 pb-8">
              <BarChart3 className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Performance Analytics</h3>
              <p className="text-muted-foreground">
                Track revenue per item, booking frequency, and seasonal trends. Know which items are your best investments.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container px-4 py-16 relative">
        <div className="absolute top-0 left-1/2 bottom-0 border-l border-dashed border-muted -z-10 hidden md:block"></div>
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How Inventory Management Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple setup, powerful organization
          </p>
        </div>
        
        <div className="space-y-12 md:space-y-24 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="md:text-right order-2 md:order-1">
              <div className="inline-flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary font-bold mb-4">1</div>
              <h3 className="text-2xl font-bold mb-3">Upload Your Inventory</h3>
              <p className="text-muted-foreground">
                Add your bounce houses, slides, and games with our easy drag-and-drop uploader. Include multiple photos and detailed descriptions for each item.
              </p>
            </div>
            <div className="relative order-1 md:order-2">
              <div className="bg-gradient-to-br from-accent/10 to-primary/10 aspect-video rounded-xl p-4 flex items-center justify-center shadow-md">
                <div className="bg-white rounded-lg p-4 shadow-sm w-full">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                      <Button size="sm" variant="outline" className="h-8">
                        <Camera size={14} className="mr-2" /> Add Item
                      </Button>
                    </div>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                      <Camera className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Drag and drop images here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 aspect-video rounded-xl p-4 flex items-center justify-center shadow-md">
                <div className="bg-white rounded-lg p-4 shadow-sm w-full">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="border border-gray-200 rounded-lg p-2">
                        <div className="flex items-center mb-2">
                          <div className="size-3 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-xs">Active</span>
                        </div>
                        <div className="h-16 bg-gray-100 rounded mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-2">
                        <div className="flex items-center mb-2">
                          <div className="size-3 rounded-full bg-amber-500 mr-2"></div>
                          <span className="text-xs">Maintenance</span>
                        </div>
                        <div className="h-16 bg-gray-100 rounded mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary font-bold mb-4">2</div>
              <h3 className="text-2xl font-bold mb-3">Organize & Categorize</h3>
              <p className="text-muted-foreground">
                Tag your inventory by type, theme, size, and age range. Set pricing, delivery requirements, and setup instructions for each item.
              </p>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="md:text-right order-2 md:order-1">
              <div className="inline-flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary font-bold mb-4">3</div>
              <h3 className="text-2xl font-bold mb-3">Track Availability</h3>
              <p className="text-muted-foreground">
                The system automatically updates availability when items are booked. View your calendar to see what&apos;s booked when and what&apos;s available.
              </p>
            </div>
            <div className="relative order-1 md:order-2">
              <div className="bg-gradient-to-br from-accent/10 to-primary/10 aspect-video rounded-xl p-4 flex items-center justify-center shadow-md">
                <div className="bg-white rounded-lg p-4 shadow-sm w-full">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                      <div className="flex space-x-2">
                        <div className="size-6 rounded-sm bg-gray-100"></div>
                        <div className="size-6 rounded-sm bg-gray-100"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array(28).fill(null).map((_, i) => (
                        <div key={i} className={`h-10 rounded flex items-center justify-center text-xs ${
                          i % 5 === 0 ? 'bg-primary/20' : 
                          i % 7 === 3 ? 'bg-amber-100' : 
                          'bg-gray-50 border border-gray-200'
                        }`}>
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Step 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 aspect-video rounded-xl p-4 flex items-center justify-center shadow-md">
                <div className="bg-white rounded-lg p-4 shadow-sm w-full">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-1/3 mb-3"></div>
                    <div className="flex space-x-4">
                      <div className="w-1/2 h-32 bg-gradient-to-b from-primary/30 to-primary/10 rounded-lg"></div>
                      <div className="w-1/2 space-y-2">
                        <div className="flex justify-between">
                          <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                        </div>
                        <div className="h-3 bg-gray-100 rounded"></div>
                        <div className="h-3 bg-gray-100 rounded"></div>
                        <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary font-bold mb-4">4</div>
              <h3 className="text-2xl font-bold mb-3">Monitor Performance</h3>
              <p className="text-muted-foreground">
                See booking frequency, revenue, and seasonal patterns for each item. Make informed decisions about future purchases based on real data.
              </p>
            </div>
          </div>
          
          {/* Step 5 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="md:text-right order-2 md:order-1">
              <div className="inline-flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary font-bold mb-4">5</div>
              <h3 className="text-2xl font-bold mb-3">Schedule Maintenance</h3>
              <p className="text-muted-foreground">
                Create maintenance schedules and get alerts when inspections are due. Track repair history and costs for each item in your fleet.
              </p>
            </div>
            <div className="relative order-1 md:order-2">
              <div className="bg-gradient-to-br from-accent/10 to-primary/10 aspect-video rounded-xl p-4 flex items-center justify-center shadow-md">
                <div className="bg-white rounded-lg p-4 shadow-sm w-full">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <PenTool className="h-5 w-5 text-amber-500 mr-2" />
                      <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center p-2 border border-amber-200 bg-amber-50 rounded-lg">
                        <Clock className="h-4 w-4 text-amber-500 mr-2" />
                        <div className="h-3 bg-amber-100 rounded w-3/4"></div>
                        <Badge className="ml-auto bg-amber-100 text-amber-800 hover:bg-amber-100">Due</Badge>
                      </div>
                      <div className="flex items-center p-2 border border-gray-200 rounded-lg">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                        <Badge className="ml-auto bg-green-100 text-green-800 hover:bg-green-100">Complete</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Details Section */}
      <section className="container px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-12">
              <TabsTrigger value="features">Key Features</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="features" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Inventory Features</h3>
                  <ul className="space-y-4">
                    {[
                      "Unlimited inventory items with multiple images",
                      "Custom categorization and tagging system",
                      "Item-specific pricing and setup requirements",
                      "Availability tracking with calendar view",
                      "Serial number and purchase tracking",
                      "Setup and safety instructions per item",
                      "Digital asset storage (manuals, warranties)",
                      "Equipment bundling for package deals",
                      "Searchable inventory database",
                      "Custom fields for your unique needs"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-6">Inventory Management</h3>
                  <ul className="space-y-4">
                    {[
                      "Item status tracking (available, booked, maintenance)",
                      "Low-resolution images for customers, high-res for crew",
                      "Detailed specifications (dimensions, capacity, etc.)",
                      "Seasonal availability settings",
                      "Delivery requirements per item",
                      "Required staffing for setup/teardown",
                      "Print inventory sheets for loading crews",
                      "Bulk inventory actions and updates",
                      "Automated inventory reconciliation",
                      "Photo records of item condition"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Performance Analytics</h3>
                  <p className="text-muted-foreground mb-6">
                    Make data-driven decisions about your inventory with detailed performance metrics and reports.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex">
                      <div className="flex-shrink-0 mt-1">
                        <BarChart3 className="h-6 w-6 text-primary mr-4" />
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">Revenue Tracking</h4>
                        <p className="text-muted-foreground">
                          Track how much revenue each item generates. See which bounce houses are your top earners and which ones might need to be retired.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 mt-1">
                        <Calendar className="h-6 w-6 text-primary mr-4" />
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">Booking Frequency</h4>
                        <p className="text-muted-foreground">
                          See how often each item is booked and spot seasonal trends. Identify which items are popular during different times of the year.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 mt-1">
                        <PieChart className="h-6 w-6 text-primary mr-4" />
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">ROI Calculator</h4>
                        <p className="text-muted-foreground">
                          Calculate the return on investment for each item based on purchase price, maintenance costs, and rental revenue.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 rounded-xl shadow-md">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <div className="h-5 w-24 bg-gray-100 rounded"></div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="h-8 px-2 text-xs">Monthly</Button>
                          <Button size="sm" variant="outline" className="h-8 px-2 text-xs bg-primary/10">Annual</Button>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="h-4 w-32 bg-gray-100 rounded"></div>
                            <div className="h-4 w-16 bg-gray-100 rounded"></div>
                          </div>
                          <div className="h-6 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-3/4 rounded-full"></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="h-4 w-28 bg-gray-100 rounded"></div>
                            <div className="h-4 w-16 bg-gray-100 rounded"></div>
                          </div>
                          <div className="h-6 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-1/2 rounded-full"></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="h-4 w-24 bg-gray-100 rounded"></div>
                            <div className="h-4 w-16 bg-gray-100 rounded"></div>
                          </div>
                          <div className="h-6 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-2/3 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="maintenance">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="relative order-2 md:order-1">
                  <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 rounded-xl shadow-md">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center mb-4">
                        <PenTool className="h-5 w-5 text-primary mr-2" />
                        <div className="h-4 w-40 bg-gray-100 rounded"></div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="border border-gray-200 rounded-lg p-3 bg-amber-50">
                          <div className="flex justify-between items-center mb-2">
                            <div className="h-4 w-32 bg-amber-100 rounded"></div>
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Due Tomorrow</Badge>
                          </div>
                          <div className="h-3 w-full bg-amber-100 rounded"></div>
                          <div className="h-3 w-2/3 bg-amber-100 rounded mt-1"></div>
                          <div className="flex justify-end mt-2">
                            <Button size="sm" variant="outline" className="h-7 text-xs">Complete</Button>
                          </div>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <div className="h-4 w-28 bg-gray-100 rounded"></div>
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Upcoming</Badge>
                          </div>
                          <div className="h-3 w-full bg-gray-100 rounded"></div>
                          <div className="h-3 w-3/4 bg-gray-100 rounded mt-1"></div>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <div className="h-4 w-36 bg-gray-100 rounded"></div>
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
                          </div>
                          <div className="h-3 w-full bg-gray-100 rounded"></div>
                          <div className="h-3 w-1/2 bg-gray-100 rounded mt-1"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="order-1 md:order-2">
                  <h3 className="text-2xl font-bold mb-6">Maintenance Management</h3>
                  <p className="text-muted-foreground mb-6">
                    Keep your equipment in top condition with our comprehensive maintenance tracking system.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex">
                      <div className="flex-shrink-0 mt-1">
                        <PenTool className="h-6 w-6 text-primary mr-4" />
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">Scheduled Maintenance</h4>
                        <p className="text-muted-foreground">
                          Create recurring maintenance schedules for each item. Set reminders for inspections, blower maintenance, and cleaning.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 mt-1">
                        <FileText className="h-6 w-6 text-primary mr-4" />
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">Repair History</h4>
                        <p className="text-muted-foreground">
                          Log all repairs with detailed notes, costs, and vendor information. Build a complete service history for each inflatable.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 mt-1">
                        <AlertTriangle className="h-6 w-6 text-primary mr-4" />
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">Automatic Alerts</h4>
                        <p className="text-muted-foreground">
                          Get email and dashboard notifications when maintenance is due. Never miss an important safety inspection again.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container px-4 py-16 relative">
        <div className="absolute -inset-x-20 top-1/3 h-52 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 blur-2xl -z-10" />
        
        <div className="text-center mb-16">
          <Badge variant="outline" className="py-1.5 px-4 mb-6 border-primary/20 bg-primary/5">
            <span className="text-primary font-medium">Customer Stories</span>
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            From Our Customers
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how inventory management has transformed bounce house businesses
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-primary/5">
            <CardContent className="p-8">
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
                &quot;Before InflateMate, we were using spreadsheets and constantly had mix-ups with our inventory. Now, we know exactly what we have, where it is, and which items are making us the most money.&quot;
              </blockquote>
              <div className="flex items-center">
                <div className="size-12 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <p className="font-medium">Robert Johnson</p>
                  <p className="text-sm text-muted-foreground">Bouncy Fun Rentals</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-accent/5">
            <CardContent className="p-8">
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
                &quot;The maintenance tracking alone is worth the price. We used to forget about inspections until something broke. Now we&apos;re proactive and our equipment lasts much longer.&quot;
              </blockquote>
              <div className="flex items-center">
                <div className="size-12 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <p className="font-medium">Sarah Martinez</p>
                  <p className="text-sm text-muted-foreground">Jumping Joy Inflatables</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Common questions about our inventory management system
            </p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border bg-card rounded-lg shadow-sm">
              <AccordionTrigger className="px-6">
                Is there a limit to how many inventory items I can add?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-muted-foreground">
                  No, InflateMate allows you to add unlimited inventory items, regardless of your subscription plan. Upload as many bounce houses, slides, and games as you need.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border bg-card rounded-lg shadow-sm">
              <AccordionTrigger className="px-6">
                How are inventory items linked to the booking system?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-muted-foreground">
                    Each inventory item automatically connects to the booking system. When a customer books an item, it&apos;s marked as unavailable in your inventory for that time period, including your set buffer times for setup and teardown.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border bg-card rounded-lg shadow-sm">
              <AccordionTrigger className="px-6">
                Can I track inventory items across multiple locations?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-muted-foreground">
                  Yes! You can set up different storage locations and track which items are stored where. This is especially helpful if you have multiple warehouses or storage units.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="border bg-card rounded-lg shadow-sm">
              <AccordionTrigger className="px-6">
                How do I track which items need maintenance?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-muted-foreground">
                  You can set maintenance schedules for each item (weekly, monthly, quarterly, etc.). The system will alert you when maintenance is due and allow you to log all service records. You can also manually mark items for maintenance when issues arise.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" className="border bg-card rounded-lg shadow-sm">
              <AccordionTrigger className="px-6">
                Can we print inventory lists for our delivery crews?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-muted-foreground">
                  Absolutely! You can generate and print daily equipment lists showing exactly which items need to be loaded for that day&apos;s events. These lists include photos, special instructions, and customer details.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        
        <div className="container px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6">
              <div className="flex items-center justify-center p-2 px-4 rounded-full bg-background">
                <Zap size={16} className="text-primary mr-2" />
                <span className="text-sm font-medium">14-day free trial</span>
              </div>
            </div>
            
            <h2 className="font-bold text-3xl md:text-5xl mb-6">
              Take Control of Your Bounce House Inventory
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8">
              Stop using spreadsheets and start using a system designed specifically for bounce house rental businesses.
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
