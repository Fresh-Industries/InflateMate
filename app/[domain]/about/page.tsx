import { getBusinessByDomain, SiteConfig } from '@/lib/business/domain-utils';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Award, ThumbsUp, Heart } from "lucide-react";
import { Metadata } from 'next';
import SectionRenderer from '../_components/SectionRenderer';

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
    const siteConfig = business.siteConfig || {} as SiteConfig;
    
    const title = `${siteConfig.about?.title || 'About'} | ${business.name}`;
    const description = siteConfig.about?.description || business.description || 'Learn more about our inflatable rental business.';
    
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
      title: 'About Us',
      description: 'Learn more about our inflatable rental business.',
    };
  }
}

async function AboutPage({ params }: PageProps) {
  const { domain } = params;
  const business = await getBusinessByDomain(domain);
  const siteConfig = business.siteConfig || {} as SiteConfig;
  const aboutSections = siteConfig.about?.dynamicSections || [];
  
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
                style={{ backgroundColor: `${colors.primary}20` }}
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

      {aboutSections.map((section) => (
        <section key={section.id} className="dynamic-section">
          <SectionRenderer section={section} />
        </section>
      ))}
      
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
                style={{ backgroundColor: `${colors.primary}20` }}
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
                style={{ backgroundColor: `${colors.primary}20` }}
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
                style={{ backgroundColor: `${colors.primary}20` }}
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
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
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
                color: colors.primary
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

export default AboutPage; 