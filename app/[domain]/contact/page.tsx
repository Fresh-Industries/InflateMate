import { getBusinessByDomain, SiteConfig } from '@/lib/business/domain-utils';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Phone, Mail, Calendar } from "lucide-react";
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    domain: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain } = params;
  
  try {
    // Get the business data
    const business = await getBusinessByDomain(domain);
    
    const title = `Contact | ${business.name}`;
    const description = 'Get in touch with us to book your inflatable rental or ask any questions.';
    
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
      title: 'Contact Us',
      description: 'Get in touch with us to book your inflatable rental.',
    };
  }
}

async function ContactPage({ params }: PageProps) {
  const { domain } = params;
  const business = await getBusinessByDomain(domain);
  const siteConfig = business.siteConfig || {} as SiteConfig;
  
  // Extract service areas from business data with proper typing
  const serviceAreas: string[] = Array.isArray(business.serviceArea) ? business.serviceArea : [];
  
  // Colors from site config
  const colors = {
    primary: siteConfig.colors?.primary || "#3b82f6", // Default blue
    secondary: siteConfig.colors?.secondary || "#6b7280", // Default gray
    accent: siteConfig.colors?.accent || "#f59e0b", // Default amber
    background: siteConfig.colors?.background || "#f9fafb", // Default gray-50
  };
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section 
        className="py-16 md:py-24 relative"
        style={{ 
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
          color: '#ffffff'
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contact {business.name}
            </h1>
            <p className="text-xl opacity-90 mb-8">
              We&apos;re here to help you plan your perfect event with our premium inflatable rentals.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {business.phone && (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-xl transition-all text-center">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${colors.primary}20` }}
                  >
                    <Phone className="h-8 w-8" style={{ color: colors.primary }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Call or Text Us</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    We&apos;re available to answer questions and take bookings.
                  </p>
                  <a 
                    href={`tel:${business.phone}`} 
                    className="font-bold text-lg block hover:underline"
                    style={{ color: colors.primary }}
                  >
                    {business.phone}
                  </a>
                </div>
              )}
              
              {business.email && (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-xl transition-all text-center">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${colors.primary}20` }}
                  >
                    <Mail className="h-8 w-8" style={{ color: colors.primary }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Email Us</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Send us an email and we&apos;ll get back to you as soon as possible.
                  </p>
                  <a 
                    href={`mailto:${business.email}`} 
                    className="font-bold text-lg block hover:underline"
                    style={{ color: colors.primary }}
                  >
                    {business.email}
                  </a>
                </div>
              )}
            </div>
            
            {/* Service Areas */}
            <Card className="border dark:border-gray-800 dark:bg-gray-800 mb-16">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2" style={{ color: colors.primary }}>
                    Service Areas
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    We proudly serve the following areas and surrounding communities
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {serviceAreas.length > 0 ? (
                    serviceAreas.map((area, index) => {
                      // Extract just the city name from the service area string
                      const cityName = area.split(',')[0].trim();
                      
                      return (
                        <div 
                          key={area} 
                          className="px-3 py-2 rounded-lg text-center font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                          style={{ 
                            backgroundColor: index % 3 === 0 ? `${colors.primary}15` : 
                                          index % 3 === 1 ? `${colors.accent}15` : 
                                          `${colors.secondary}15`,
                            color: index % 3 === 0 ? colors.primary : 
                                  index % 3 === 1 ? colors.accent : 
                                  colors.secondary
                          }}
                        >
                          {cityName}
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-4 text-center py-4 text-gray-500">
                      No service areas defined yet.
                    </div>
                  )}
                </div>
                <p className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Not sure if we deliver to your area? Contact us to find out!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section 
        className="py-16 text-white relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
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
              color: colors.primary
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

export default ContactPage;
