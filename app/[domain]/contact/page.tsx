import { getBusinessByDomain, SiteConfig } from '@/lib/business/domain-utils';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Phone, Mail, Calendar } from "lucide-react";
import { Metadata } from 'next';
import { ThemeColors, themeConfig, getContrastColor } from '../_themes/themeConfig';

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
  const colors: ThemeColors = {
    primary: siteConfig.colors?.primary || "#3b82f6",
    secondary: siteConfig.colors?.secondary || "#6b7280",
    accent: siteConfig.colors?.accent || "#f59e0b",
    background: siteConfig.colors?.background || "#f9fafb",
    text: siteConfig.colors?.text || "#111827",
  };

  // Get theme configuration
  const themeName = siteConfig.themeName?.name || 'modern';
  const theme = themeConfig[themeName] || themeConfig.modern;

  // Pre-compute common styles
  const cardStyle = {
    background: theme.cardStyles.background(colors),
    border: theme.cardStyles.border(colors),
    boxShadow: theme.cardStyles.boxShadow(colors),
    color: theme.cardStyles.textColor(colors),
    borderRadius: theme.cardStyles.borderRadius || '16px',
  };

  const buttonStyle = {
    background: theme.buttonStyles.background(colors),
    color: theme.buttonStyles.textColor(colors),
    border: theme.buttonStyles.border?.(colors) || 'none',
    boxShadow: theme.buttonStyles.boxShadow?.(colors) || 'none',
    borderRadius: theme.buttonStyles.borderRadius || '12px',
    transition: theme.buttonStyles.transition || 'all 0.3s ease',
  };

  // Hero section style
  const heroStyle = {
    background: theme.heroBackground ? theme.heroBackground(colors) : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
    color: theme.heroTextColor ? theme.heroTextColor(colors) : getContrastColor(colors.primary),
  };

  // Contact card style
  const contactCardStyle = {
    ...cardStyle,
    transition: 'all 0.3s ease',
  };

  // CTA section style
  const ctaStyle = theme.ctaStyles ? {
    background: theme.ctaStyles.background(colors),
    color: theme.ctaStyles.textColor(colors),
  } : {
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
    color: getContrastColor(colors.primary),
  };
  
  return (
    <div className="min-h-screen" style={{ background: colors.background }}>
      {/* Hero Section */}
      <section 
        className="py-16 md:py-24 relative overflow-hidden"
        style={heroStyle}
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {business.phone && (
                <div 
                  className="p-8 transition-all hover:shadow-xl hover:-translate-y-1"
                  style={contactCardStyle}
                >
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ 
                      background: theme.featureSectionStyles?.iconBackground(colors, 0) || `${colors.primary}20`,
                      color: theme.featureSectionStyles?.cardTitleColor(colors, 0) || colors.primary
                    }}
                  >
                    <Phone className="h-8 w-8" />
                  </div>
                  <h3 
                    className="text-xl font-bold mb-3 text-center"
                    style={{ color: theme.featureSectionStyles?.cardTitleColor(colors, 0) || colors.primary }}
                  >
                    Call or Text Us
                  </h3>
                  <p 
                    className="mb-4 text-center"
                    style={{ color: theme.featureSectionStyles?.cardTextColor(colors) || colors.text }}
                  >
                    We&apos;re available to answer questions and take bookings.
                  </p>
                  <a 
                    href={`tel:${business.phone}`} 
                    className="font-bold text-lg block text-center hover:underline"
                    style={{ color: colors.primary }}
                  >
                    {business.phone}
                  </a>
                </div>
              )}
              
              {business.email && (
                <div 
                  className="p-8 transition-all hover:shadow-xl hover:-translate-y-1"
                  style={contactCardStyle}
                >
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ 
                      background: theme.featureSectionStyles?.iconBackground(colors, 1) || `${colors.accent}20`,
                      color: theme.featureSectionStyles?.cardTitleColor(colors, 1) || colors.accent
                    }}
                  >
                    <Mail className="h-8 w-8" />
                  </div>
                  <h3 
                    className="text-xl font-bold mb-3 text-center"
                    style={{ color: theme.featureSectionStyles?.cardTitleColor(colors, 1) || colors.accent }}
                  >
                    Email Us
                  </h3>
                  <p 
                    className="mb-4 text-center"
                    style={{ color: theme.featureSectionStyles?.cardTextColor(colors) || colors.text }}
                  >
                    Send us an email and we&apos;ll get back to you as soon as possible.
                  </p>
                  <a 
                    href={`mailto:${business.email}`} 
                    className="font-bold text-lg block text-center hover:underline"
                    style={{ color: colors.accent }}
                  >
                    {business.email}
                  </a>
                </div>
              )}
            </div>
            
            {/* Service Areas */}
            <Card style={cardStyle} className="mb-16">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h2 
                    className="text-2xl font-bold mb-2"
                    style={{ color: theme.featureSectionStyles?.titleColor(colors) || colors.primary }}
                  >
                    Service Areas
                  </h2>
                  <p style={{ color: theme.featureSectionStyles?.cardTextColor(colors) || colors.text }}>
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
                            background: theme.contactStyles?.serviceAreaTagBackground(colors, index) || 
                              (index % 3 === 0 ? `${colors.primary}15` : 
                               index % 3 === 1 ? `${colors.accent}15` : 
                               `${colors.secondary}15`),
                            color: theme.contactStyles?.serviceAreaTagColor(colors, index) ||
                              (index % 3 === 0 ? colors.primary : 
                               index % 3 === 1 ? colors.accent : 
                               colors.secondary)
                          }}
                        >
                          {cityName}
                        </div>
                      );
                    })
                  ) : (
                    <div 
                      className="col-span-4 text-center py-4"
                      style={{ color: theme.cardStyles.textColor(colors) }}
                    >
                      No service areas defined yet.
                    </div>
                  )}
                </div>
                <p 
                  className="text-center mt-4 text-sm"
                  style={{ color: `${theme.cardStyles.textColor(colors)}80` }}
                >
                  Not sure if we deliver to your area? Contact us to find out!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section 
        className="py-16 relative overflow-hidden"
        style={ctaStyle}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Book Your Event?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8 opacity-90">
            Check availability and reserve your inflatable rental today!
          </p>
          <Button 
            asChild
            className="text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            style={buttonStyle}
          >
            <Link href={`/${domain}/booking`} className="flex items-center gap-2">
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
