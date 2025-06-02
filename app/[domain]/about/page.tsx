import { getBusinessByDomain, SiteConfig } from '@/lib/business/domain-utils';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Award, ThumbsUp, Heart } from "lucide-react";
import { Metadata } from 'next';
import SectionRenderer from '../_components/SectionRenderer';
import { themeConfig } from '../_themes/themeConfig';
import { ThemeColors, ThemeDefinition } from '../_themes/types';
import { getContrastColor, makeScale } from '../_themes/utils';
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ domain: string  }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const domain = decodeURIComponent(params.domain);

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

export default async function AboutPage({ params }: { params: Promise<{ domain: string }> }) {
  const domain = decodeURIComponent((await params).domain);
  const business = await getBusinessByDomain(domain);
  const siteConfig = business.siteConfig || {} as SiteConfig;
  const aboutSections = siteConfig.about?.dynamicSections || [];
  
  
  try {
    const business = await getBusinessByDomain(domain);
    const siteConfig = business.siteConfig || {};
    
    // Determine Theme
    const rawThemeName = (siteConfig.themeName?.name as string) || 'modern';
    const themeName = Object.keys(themeConfig).includes(rawThemeName) ? rawThemeName : 'modern';
    const theme: ThemeDefinition = themeConfig[themeName];
    
    // Get base colors from site config with fallbacks
    const primaryColor = siteConfig.colors?.primary || '#4f46e5';
    const accentColor = siteConfig.colors?.accent || '#f97316';
    const secondaryColor = siteConfig.colors?.secondary || '#06b6d4';
    const backgroundColor = siteConfig.colors?.background || '#ffffff';
    const textColor = siteConfig.colors?.text || '#333333';
    
    // Define Colors with scales for each color using makeScale
    const colors: ThemeColors = {
      primary: makeScale(primaryColor),
      accent: makeScale(accentColor),
      secondary: makeScale(secondaryColor),
      background: makeScale(backgroundColor),
      text: makeScale(textColor)
    };


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
  const defaultHeroBackground = `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.accent[500]} 100%)`;
  const defaultHeroColor = getContrastColor(colors.primary[500]);

  const heroStyle: React.CSSProperties = {};

  const themeProvidedBackground = theme.heroBackground 
    ? theme.heroBackground(colors) 
    : defaultHeroBackground;

  if (typeof themeProvidedBackground === 'string') {
    heroStyle.background = themeProvidedBackground;
  } else if (themeProvidedBackground && typeof themeProvidedBackground === 'object') {
    Object.assign(heroStyle, themeProvidedBackground);
  }

  heroStyle.color = theme.heroTextColor 
    ? theme.heroTextColor(colors) 
    : defaultHeroColor;

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
    <div className="min-h-screen" style={{ background: colors.background[500] }}>
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
                  color: colors.primary[500]
                }}
              >
                <Users className="h-8 w-8" />
              </div>
            </div>
            
            <h2 
              className="text-3xl font-bold text-center mb-8"
              style={{ color: theme.featureSectionStyles?.titleColor(colors) || colors.primary[500] }}
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
          <SectionRenderer section={section} themeName={themeName} colors={colors} />
        </section>
      ))}
      
      {/* Why Choose Us Section */}
      <section className="py-16" style={{ background: theme.cardStyles.background(colors) }}>
        <div className="container mx-auto px-4">
          <h2 
            className="text-3xl font-bold text-center mb-12"
            style={{ color: theme.featureSectionStyles?.titleColor(colors) || colors.primary[500] }}
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
                    color: theme.featureSectionStyles?.cardTitleColor(colors, index) || colors.primary[500]
                  }}
                >
                  {feature.icon}
                </div>
                <h3 
                  className="text-xl font-bold mb-3 text-center"
                  style={{ color: theme.featureSectionStyles?.cardTitleColor(colors, index) || colors.primary[500] }}
                >
                  {feature.title}
                </h3>
                <p 
                  className="text-center"
                  style={{ color: theme.featureSectionStyles?.cardTextColor(colors) || colors.text[500] }}
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
              <Link href={`/booking`}>Book Now</Link>
            </Button>
            <Button 
              asChild
              className="text-lg font-bold transition-all hover:scale-105"
              style={secondaryButtonStyle}
            >
              <Link href={`/inventory`}>View Inventory</Link>
            </Button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48"></div>
      </section>
    </div>
  );
} catch (error) {
  console.error('Error loading about page:', error);
  return <div>Error loading page content</div>;
}
}