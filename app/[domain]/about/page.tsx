import { getBusinessByDomain, SiteConfig } from '@/lib/business/domain-utils';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Award, ThumbsUp, Heart } from "lucide-react";
import { Metadata } from 'next';
import SectionRenderer from '../_components/SectionRenderer';
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
  const colors: ThemeColors = {
    primary: siteConfig.colors?.primary || "#3b82f6", // Default blue
    secondary: siteConfig.colors?.secondary || "#6b7280", // Default gray
    accent: siteConfig.colors?.accent || "#f59e0b", // Default amber
    background: siteConfig.colors?.background || "#f9fafb", // Default gray-50
    text: siteConfig.colors?.text || "#111827", // Default text color
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

  const secondaryButtonStyle = theme.secondaryButtonStyles ? {
    background: theme.secondaryButtonStyles.background(colors),
    color: theme.secondaryButtonStyles.textColor(colors),
    border: theme.secondaryButtonStyles.border?.(colors),
    boxShadow: theme.secondaryButtonStyles.boxShadow?.(colors),
    borderRadius: theme.secondaryButtonStyles.borderRadius,
    transition: theme.secondaryButtonStyles.transition,
  } : buttonStyle;

  // Hero section style
  const heroStyle = {
    background: theme.heroBackground ? theme.heroBackground(colors) : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
    color: theme.heroTextColor ? theme.heroTextColor(colors) : getContrastColor(colors.primary),
  };

  // Feature card style (Why Choose Us section)
  const featureCardStyle = {
    background: theme.cardStyles.background(colors),
    border: theme.cardStyles.border(colors),
    boxShadow: theme.cardStyles.boxShadow(colors),
    borderRadius: theme.cardStyles.borderRadius,
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ 
                  background: theme.featureSectionStyles?.iconBackground(colors, 0) || `${colors.primary}20`,
                  color: colors.primary
                }}
              >
                <Users className="h-8 w-8" />
              </div>
            </div>
            
            <h2 
              className="text-3xl font-bold text-center mb-8"
              style={{ color: theme.featureSectionStyles?.titleColor(colors) || colors.primary }}
            >
              Our Story
            </h2>
            
            <Card style={cardStyle}>
              <CardContent className="pt-6">
                <div className="prose max-w-none">
                  {siteConfig.about?.description ? (
                    <div dangerouslySetInnerHTML={{ __html: siteConfig.about.description }} style={{ color: cardStyle.color }} />
                  ) : business.description ? (
                    <div dangerouslySetInnerHTML={{ __html: business.description }} style={{ color: cardStyle.color }} />
                  ) : (
                    <div className="space-y-4" style={{ color: cardStyle.color }}>
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
          <SectionRenderer section={section} theme={theme} colors={colors} />
        </section>
      ))}
      
      {/* Why Choose Us Section */}
      <section className="py-16" style={{ background: theme.cardStyles.background(colors) }}>
        <div className="container mx-auto px-4">
          <h2 
            className="text-3xl font-bold text-center mb-12"
            style={{ color: theme.featureSectionStyles?.titleColor(colors) || colors.primary }}
          >
            Why Choose Us
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Award className="h-8 w-8" />,
                title: "Quality Equipment",
                description: "We maintain our inflatables to the highest standards, ensuring they're clean, safe, and ready for your event."
              },
              {
                icon: <ThumbsUp className="h-8 w-8" />,
                title: "Reliable Service",
                description: "On-time delivery, professional setup, and prompt pickup — we're committed to making your experience hassle-free."
              },
              {
                icon: <Heart className="h-8 w-8" />,
                title: "Customer Satisfaction",
                description: "Your happiness is our priority. We go above and beyond to ensure your event is a success."
              }
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className="p-6 transition-all hover:shadow-xl hover:-translate-y-1"
                style={featureCardStyle}
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ 
                    background: theme.featureSectionStyles?.iconBackground(colors, index) || `${colors.primary}20`,
                    color: theme.featureSectionStyles?.cardTitleColor(colors, index) || colors.primary
                  }}
                >
                  {feature.icon}
                </div>
                <h3 
                  className="text-xl font-bold mb-3 text-center"
                  style={{ color: theme.featureSectionStyles?.cardTitleColor(colors, index) || colors.primary }}
                >
                  {feature.title}
                </h3>
                <p 
                  className="text-center"
                  style={{ color: theme.featureSectionStyles?.cardTextColor(colors) || colors.text }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section 
        className="py-16 relative overflow-hidden"
        style={ctaStyle}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make Your Event Special?
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-8 opacity-90">
            Browse our inventory and book your inflatable rental today!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              asChild
              className="text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              style={buttonStyle}
            >
              <Link href={`/${domain}/booking`}>Book Now</Link>
            </Button>
            <Button 
              asChild
              className="text-lg font-bold transition-all hover:scale-105"
              style={secondaryButtonStyle}
            >
              <Link href={`/${domain}/inventory`}>View Inventory</Link>
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