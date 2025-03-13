import { notFound } from 'next/navigation';
import { getBusinessByDomain, BusinessWithSiteConfig, SiteConfig } from '@/lib/business/domain-utils';
import InventoryDisplay from '@/components/tenant/InventoryDisplay';
import BookingForm from '@/components/tenant/BookingForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Users, Award, ThumbsUp, Heart, Calendar } from "lucide-react";
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    domain: string;
    slug: string;
  };
}

interface Colors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain, slug } = params;
  
  try {
    // Get the business data
    const business = await getBusinessByDomain(domain);
    const siteConfig = business.siteConfig || {} as SiteConfig;
    
    // Get page-specific title and description
    let title = business.name;
    let description = business.description || 'Premium inflatable rentals for birthdays, events, and parties.';
    
    // Special pages
    if (slug === 'about') {
      title = `${siteConfig.about?.title || 'About'} | ${business.name}`;
      description = siteConfig.about?.description || business.description || 'Learn more about our inflatable rental business.';
    } else if (slug === 'contact') {
      title = `Contact | ${business.name}`;
      description = 'Get in touch with us to book your inflatable rental or ask any questions.';
    } else if (slug === 'inventory') {
      title = `Inventory | ${business.name}`;
      description = 'Browse our selection of premium inflatable rentals for your next event.';
    } else if (slug === 'booking') {
      title = `Book Now | ${business.name}`;
      description = 'Book your inflatable rental for your next event.';
    } else {
      // Check if it's a custom page
      const pageContent = siteConfig.pages?.[slug];
      if (pageContent) {
        title = `${pageContent.title || slug} | ${business.name}`;
        description = pageContent.content?.substring(0, 160) || description;
      }
    }
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: business.coverImage ? [business.coverImage] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: business.coverImage ? [business.coverImage] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }
}

async function SlugPage({ params }: PageProps) {
  const { domain, slug } = params;
  const business = await getBusinessByDomain(domain);
  const siteConfig = business.siteConfig || {} as SiteConfig;
  
  // Special pages that have dedicated components
  const specialPages = ['booking', 'inventory'];
  
  // Check if this is a special page
  if (specialPages.includes(slug)) {
    return renderSpecialPage(slug, business);
  }
  
  // Get the page content from siteConfig based on slug
  const pageContent = siteConfig.pages?.[slug];
  
  // Colors from site config
  const colors: Colors = {
    primary: siteConfig.colors?.primary || "#3b82f6", // Default blue
    secondary: siteConfig.colors?.secondary || "#6b7280", // Default gray
    accent: siteConfig.colors?.accent || "#f59e0b", // Default amber
    background: siteConfig.colors?.background || "#f9fafb", // Default gray-50
  };
  
  // If page doesn't exist in config, check for standard pages
  if (!pageContent) {
    // Handle standard pages like "about", "contact", etc.
    if (slug === 'about') {
      return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
          {/* Hero Section */}
          <section 
            className="py-16 md:py-24 relative"
            style={{ 
              background: `linear-gradient(135deg, ${colors.primary || '#3b82f6'} 0%, ${colors.accent || '#f59e0b'} 100%)`,
              color: '#ffffff'
            }}
          >
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  {siteConfig.about?.title || `About ${business.name}`}
                </h1>
                <p className="text-xl opacity-90 mb-8">
                  We&apos;re passionate about bringing joy and excitement to your events with premium inflatable rentals.
                </p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48"></div>
          </section>
          
          {/* Our Story Section */}
          <section className="py-16 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-8">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${colors.primary}20` || '#3b82f620' }}
                  >
                    <Users className="h-8 w-8" style={{ color: colors.primary }} />
                  </div>
                </div>
                
                <h2 
                  className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white"
                  style={{ color: colors.primary }}
                >
                  Our Story
                </h2>
                
                <Card className="border dark:border-gray-800 dark:bg-gray-800">
                  <CardContent className="pt-6">
                    <div className="prose dark:prose-invert max-w-none">
                      {siteConfig.about?.description ? (
                        <div dangerouslySetInnerHTML={{ __html: siteConfig.about.description }} className="text-gray-700 dark:text-gray-300" />
                      ) : business.description ? (
                        <div dangerouslySetInnerHTML={{ __html: business.description }} className="text-gray-700 dark:text-gray-300" />
                      ) : (
                        <div className="space-y-4 text-gray-700 dark:text-gray-300">
                          <p>
                            Welcome to {business.name}, your premier destination for high-quality inflatable rentals! We started our journey with a simple mission: to bring joy, excitement, and unforgettable memories to events of all kinds.
                          </p>
                          <p>
                            What began as a small family business has grown into a trusted name in the community. We take pride in offering clean, safe, and fun inflatable rentals that transform ordinary gatherings into extraordinary experiences.
                          </p>
                          <p>
                            Our team is dedicated to providing exceptional customer service from your first inquiry to the final pickup. We understand that every event is special, and we&apos;re committed to helping you make it perfect.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
          
          {/* Why Choose Us Section */}
          <section className="py-16 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-4">
              <h2 
                className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white"
                style={{ color: colors.primary }}
              >
                Why Choose Us
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-xl transition-all text-center">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${colors.primary}20` || '#3b82f620' }}
                  >
                    <Award className="h-8 w-8" style={{ color: colors.primary }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Quality Equipment</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We maintain our inflatables to the highest standards, ensuring they&apos;re clean, safe, and ready for your event.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-xl transition-all text-center">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${colors.primary}20` || '#3b82f620' }}
                  >
                    <ThumbsUp className="h-8 w-8" style={{ color: colors.primary }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Reliable Service</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    On-time delivery, professional setup, and prompt pickup &mdash; we&apos;re committed to making your experience hassle-free.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-xl transition-all text-center">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${colors.primary}20` || '#3b82f620' }}
                  >
                    <Heart className="h-8 w-8" style={{ color: colors.primary }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Customer Satisfaction</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your happiness is our priority. We go above and beyond to ensure your event is a success.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* CTA Section */}
          <section 
            className="py-16 text-white relative overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${colors.primary || '#3b82f6'} 0%, ${colors.accent || '#f59e0b'} 100%)`,
            }}
          >
            <div className="container mx-auto px-4 text-center relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make Your Event Special?</h2>
              <p className="text-xl max-w-2xl mx-auto mb-8 opacity-90">
                Browse our inventory and book your inflatable rental today!
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                  style={{ 
                    backgroundColor: '#ffffff',
                    color: colors.primary || '#3b82f6'
                  }}
                >
                  <Link href="/booking">Book Now</Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg font-bold bg-white/10 hover:bg-white/20 border-white text-white"
                >
                  <Link href="/inventory">View Inventory</Link>
                </Button>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48"></div>
          </section>
        </div>
      );
    }
    
    if (slug === 'contact') {
      return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
          {/* Hero Section */}
          <section 
            className="py-16 md:py-24 relative"
            style={{ 
              background: `linear-gradient(135deg, ${colors.primary || '#3b82f6'} 0%, ${colors.accent || '#f59e0b'} 100%)`,
              color: '#ffffff'
            }}
          >
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Contact {business.name}
                </h1>
                <p className="text-xl opacity-90 mb-8">
                  We&apos;re here to answer your questions and help you plan your perfect event.
                </p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48"></div>
          </section>
          
          {/* Contact Info Cards */}
          <section className="py-16 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                  {business.phone && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all text-center">
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{ backgroundColor: `${colors.primary}20` || '#3b82f620' }}
                      >
                        <Phone className="h-8 w-8" style={{ color: colors.primary }} />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Call Us</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        We&apos;re available to take your call during business hours.
                      </p>
                      <a 
                        href={`tel:${business.phone}`} 
                        className="font-bold text-lg block"
                        style={{ color: colors.primary }}
                      >
                        {business.phone}
                      </a>
                    </div>
                  )}
                  
                  {business.email && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all text-center">
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{ backgroundColor: `${colors.primary}20` || '#3b82f620' }}
                      >
                        <Mail className="h-8 w-8" style={{ color: colors.primary }} />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Email Us</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Send us an email and we&apos;ll get back to you as soon as possible.
                      </p>
                      <a 
                        href={`mailto:${business.email}`} 
                        className="font-bold text-lg block"
                        style={{ color: colors.primary }}
                      >
                        {business.email}
                      </a>
                    </div>
                  )}
                  
                  {business.address && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all text-center">
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{ backgroundColor: `${colors.primary}20` || '#3b82f620' }}
                      >
                        <MapPin className="h-8 w-8" style={{ color: colors.primary }} />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Visit Us</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Our location is easily accessible with plenty of parking.
                      </p>
                      <address className="not-italic text-gray-600 dark:text-gray-400">
                        {business.address}<br />
                        {business.city}, {business.state} {business.zipCode}
                      </address>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Business Hours */}
                  <Card className="border dark:border-gray-800 dark:bg-gray-800">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${colors.primary}20` || '#3b82f620' }}
                        >
                          <Clock className="h-5 w-5" style={{ color: colors.primary }} />
                        </div>
                        <div>
                          <CardTitle className="text-gray-900 dark:text-white">Business Hours</CardTitle>
                          <CardDescription>When you can reach us</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Monday - Friday</span>
                          <span className="text-gray-600 dark:text-gray-400">9:00 AM - 5:00 PM</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Saturday</span>
                          <span className="text-gray-600 dark:text-gray-400">10:00 AM - 4:00 PM</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Sunday</span>
                          <span className="text-gray-600 dark:text-gray-400">Closed</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Please note that our hours may vary on holidays. Contact us for specific holiday hours.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Service Areas */}
                  <Card className="border dark:border-gray-800 dark:bg-gray-800">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${colors.primary}20` || '#3b82f620' }}
                        >
                          <MapPin className="h-5 w-5" style={{ color: colors.primary }} />
                        </div>
                        <div>
                          <CardTitle className="text-gray-900 dark:text-white">Service Areas</CardTitle>
                          <CardDescription>Where we deliver</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {['Phoenix', 'Scottsdale', 'Tempe', 'Mesa', 'Chandler', 'Gilbert', 'Glendale', 'Peoria'].map((city) => (
                          <div 
                            key={city} 
                            className="px-3 py-2 rounded-lg text-center"
                            style={{ 
                              backgroundColor: `${colors.primary}10` || '#3b82f610',
                              color: colors.primary || '#3b82f6'
                            }}
                          >
                            {city}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
          
          {/* Map Section */}
          <section className="py-16 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 
                  className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white"
                  style={{ color: colors.primary }}
                >
                  Find Us
                </h2>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md">
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                    {/* This would be replaced with an actual map in a real implementation */}
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400">Map would be displayed here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* CTA Section */}
          <section 
            className="py-16 text-white relative overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${colors.primary || '#3b82f6'} 0%, ${colors.accent || '#f59e0b'} 100%)`,
            }}
          >
            <div className="container mx-auto px-4 text-center relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Book Your Event?</h2>
              <p className="text-xl max-w-2xl mx-auto mb-8 opacity-90">
                Check availability and reserve your inflatable rental today!
              </p>
              <Button 
                size="lg" 
                className="text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                style={{ 
                  backgroundColor: '#ffffff',
                  color: colors.primary || '#3b82f6'
                }}
              >
                <Link href="/booking" className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Book Now
                </Link>
              </Button>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48"></div>
          </section>
        </div>
      );
    }
    
    // If not a standard page and not in config, return 404
    notFound();
  }
  
  // Render the dynamic page content
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 
        className="text-3xl font-bold mb-6 text-gray-900 dark:text-white"
        style={{ color: colors.primary }}
      >
        {pageContent.title || slug}
      </h1>
      <Card className="border dark:border-gray-800 dark:bg-gray-800">
        {pageContent.imageUrl && (
          <div className="w-full h-64 relative overflow-hidden rounded-t-lg">
            <img 
              src={pageContent.imageUrl} 
              alt={pageContent.title || slug} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            {pageContent.content ? (
              <div dangerouslySetInnerHTML={{ __html: pageContent.content }} className="text-gray-700 dark:text-gray-300" />
            ) : (
              <p className="text-gray-700 dark:text-gray-300">No content available.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Function to render special pages with dedicated components
function renderSpecialPage(slug: string, business: BusinessWithSiteConfig) {
  // Colors from site config
  const siteConfig = business.siteConfig || {} as SiteConfig;
  const colors: Colors = {
    primary: siteConfig.colors?.primary || "#3b82f6", // Default blue
    secondary: siteConfig.colors?.secondary || "#6b7280", // Default gray
    accent: siteConfig.colors?.accent || "#f59e0b", // Default amber
    background: siteConfig.colors?.background || "#f9fafb", // Default gray-50
  };

  switch (slug) {
    case 'booking':
      return (
        <div className="container mx-auto px-4 py-8">
          <h1 
            className="text-3xl font-bold mb-6 text-gray-900 dark:text-white"
            style={{ color: colors.primary }}
          >
            Book with {business.name}
          </h1>
          <Card className="border dark:border-gray-800 dark:bg-gray-800">
            <CardContent className="pt-6">
              <BookingForm businessId={business.id} siteConfig={business.siteConfig} />
            </CardContent>
          </Card>
        </div>
      );
      
    case 'inventory':
      return (
        <div className="container mx-auto px-4 py-8">
          <h1 
            className="text-3xl font-bold mb-6 text-gray-900 dark:text-white"
            style={{ color: colors.primary }}
          >
            Our Inventory
          </h1>
          <Card className="border dark:border-gray-800 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Browse Our Items</CardTitle>
              <CardDescription>
                Find the perfect inflatable or game for your next event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InventoryDisplay businessId={business.id} siteConfig={business.siteConfig} />
            </CardContent>
          </Card>
        </div>
      );
      
    default:
      return notFound();
  }
}

export default SlugPage;
