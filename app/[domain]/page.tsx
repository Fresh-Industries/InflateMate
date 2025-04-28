// DomainPage.tsx

import { notFound } from 'next/navigation';
import { DynamicSection, getBusinessByDomain } from '@/lib/business/domain-utils';
import Link from 'next/link';
import { Star, ArrowRight, Sparkles, Truck } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import SectionRenderer from './_components/SectionRenderer';
import { themeConfig, ThemeDefinition, ThemeColors } from '@/app/[domain]/_themes/themeConfig';
import { getContrastColor } from '@/app/[domain]/_themes/themeConfig';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ domain: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const domain = decodeURIComponent(params.domain);

  try {
    const business = await getBusinessByDomain(domain);
    const title = business.name;
    const description = business.description || 'Premium inflatable rentals for birthdays, events, and parties.';
    const heroTitle = business.siteConfig?.hero?.title;
    const heroDescription = business.siteConfig?.hero?.description;
    
    return {
      title,
      description: heroDescription || description,
      openGraph: {
        title: heroTitle || title,
        description: heroDescription || description,
        images: business.coverImage ? [business.coverImage] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: heroTitle || title,
        description: heroDescription || description,
        images: business.coverImage ? [business.coverImage] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Inflatable Rentals',
      description: 'Premium inflatable rentals for birthdays, events, and parties.',
    };
  }
}

// --- Helper for generating Button Styles ---
const getButtonStyle = (theme: ThemeDefinition, colors: ThemeColors, type: 'primary' | 'secondary' = 'primary'): React.CSSProperties => {
  const baseStyles = theme.buttonStyles;
  const secondaryStyles = theme.secondaryButtonStyles;
  const styles = (type === 'secondary' && secondaryStyles) ? secondaryStyles : baseStyles;
  const fallbackStyles = baseStyles; // Always fallback to primary button styles

  // For secondary buttons with transparent background, use the text color directly from the theme
  if (type === 'secondary' && secondaryStyles && secondaryStyles.background(colors) === 'transparent') {
    return {
      background: styles?.background?.(colors) ?? fallbackStyles.background(colors),
      border: styles?.border?.(colors) ?? fallbackStyles.border?.(colors) ?? 'none',
      boxShadow: styles?.boxShadow?.(colors) ?? fallbackStyles.boxShadow?.(colors) ?? 'none',
      borderRadius: styles?.borderRadius ?? fallbackStyles.borderRadius ?? '12px',
      transition: styles?.transition ?? fallbackStyles.transition ?? 'all 0.3s ease',
      color: styles.textColor(colors), // Use the theme's text color directly
    };
  }

  return {
    background: styles?.background?.(colors) ?? fallbackStyles.background(colors),
    border: styles?.border?.(colors) ?? fallbackStyles.border?.(colors) ?? 'none',
    boxShadow: styles?.boxShadow?.(colors) ?? fallbackStyles.boxShadow?.(colors) ?? 'none',
    borderRadius: styles?.borderRadius ?? fallbackStyles.borderRadius ?? '12px',
    transition: styles?.transition ?? fallbackStyles.transition ?? 'all 0.3s ease',
    color: styles.textColor(colors) ?? fallbackStyles.textColor(colors),
  };
};

// --- Helper for generating Card Styles ---
const getCardStyle = (theme: ThemeDefinition, colors: ThemeColors): React.CSSProperties => {
  const styles = theme.cardStyles;
  return {
    backgroundColor: styles.background(colors),
    border: styles.border(colors),
    boxShadow: styles.boxShadow(colors),
    color: styles.textColor(colors),
    borderRadius: styles.borderRadius || '16px', // Default modern rounding if not specified
  };
};

// --- Domain Page Component ---
export default async function DomainPage({ params }: { params: Promise<{ domain: string }> }) {
  const domain = decodeURIComponent((await params).domain);
  
  try {
    const business = await getBusinessByDomain(domain);
    const siteConfig = business.siteConfig || {};
    
    // Determine Theme
    const rawThemeName = (siteConfig.themeName?.name as string) || 'modern';
    const themeName = Object.keys(themeConfig).includes(rawThemeName) ? rawThemeName : 'modern';
    const theme: ThemeDefinition = themeConfig[themeName];
    
    // Define Colors (with fallbacks)
    const colors: ThemeColors = {
      primary: siteConfig.colors?.primary || '#4f46e5',
      accent: siteConfig.colors?.accent || '#f97316',
      secondary: siteConfig.colors?.secondary || '#06b6d4',
      background: siteConfig.colors?.background || '#ffffff',
      text: siteConfig.colors?.text || '#333333'
    };


    // Button Styles
    const primaryButtonStyle = getButtonStyle(theme, colors, 'primary');
    const secondaryButtonStyle = getButtonStyle(theme, colors, 'secondary');
    

    // Card Style
    const cardStyle = getCardStyle(theme, colors);

    // Hero Section Styles
    const heroBg = theme.heroBackground ? theme.heroBackground(colors) : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`;
    const heroTitleColor = theme.heroTitleColor ? theme.heroTitleColor(colors) : getContrastColor(colors.primary);
    const heroTextColor = theme.heroTextColor ? theme.heroTextColor(colors) : getContrastColor(colors.secondary);
    const heroImageStyle = theme.imageStyles(colors); // Get image style from theme

    // Feature Section Styles
    const featureStyles = theme.featureSectionStyles;
    const featureTitleStyle = { color: featureStyles ? featureStyles.titleColor(colors) : colors.primary };
    const getFeatureCardStyle = (index: number) => ({
        backgroundColor: featureStyles ? featureStyles.cardBackground(colors, index) : `${colors.primary}10`,
        borderRadius: cardStyle.borderRadius, // Use consistent card rounding
        border: cardStyle.border, // Use card border
        boxShadow: cardStyle.boxShadow, // Ensure boxShadow is used
        
    });
    const getFeatureIconStyle = (index: number) => ({
      backgroundColor: featureStyles ? featureStyles.iconBackground(colors, index) : `${colors.primary}20`,
      borderRadius: primaryButtonStyle.borderRadius === '0px' ? '0px' : '9999px', // Match button rounding (pill or square)
      border: featureStyles ? featureStyles.iconBorder(colors, index) : cardStyle.border,
      boxShadow: featureStyles ? featureStyles.iconBoxShadow(colors, index) : cardStyle.boxShadow,
    });
    const getFeatureCardTitleStyle = (index: number) => ({ 
      color: featureStyles ? featureStyles.cardTitleColor(colors, index) : colors.primary 
    });
    const featureCardTextStyle = { color: featureStyles ? featureStyles.cardTextColor(colors) : '#6b7280' };

    // Popular Rentals Section Styles
    const popularRentalsStyles = theme.popularRentalsStyles;
    const popularRentalsTitleStyle = { color: popularRentalsStyles ? popularRentalsStyles.titleColor(colors) : colors.primary };
    const popularCardTopStyle = { 
      background: popularRentalsStyles ? popularRentalsStyles.cardBackgroundGradient(colors) : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
      // Apply top part of card rounding
      borderTopLeftRadius: cardStyle.borderRadius,
      borderTopRightRadius: cardStyle.borderRadius,
    };
    const popularCardImageStyle = { // Apply rounding to image inside the card top
        borderTopLeftRadius: cardStyle.borderRadius,
        borderTopRightRadius: cardStyle.borderRadius,
    };
    const popularPriceStyle = { color: popularRentalsStyles ? popularRentalsStyles.priceColor(colors) : colors.primary };
    const popularCardStyle = { ...cardStyle }; // Base popular card style from theme

    // CTA Section Styles
    const ctaStyles = theme.ctaStyles;
    const ctaSectionStyle = {
      background: ctaStyles ? ctaStyles.background(colors) : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
      color: ctaStyles ? ctaStyles.textColor(colors) : getContrastColor(colors.primary) // Use contrast color for text
    };
    const ctaTitleStyle = { color: ctaStyles ? ctaStyles.titleColor(colors) : getContrastColor(colors.primary) }; // Contrast title
    const ctaTextStyle = { color: ctaStyles ? ctaStyles.textColor(colors) : getContrastColor(colors.secondary) }; // Contrast text

    // Contact Section Styles
    const contactStyles = theme.contactStyles;
    const contactSectionBgStyle = {
      background: contactStyles ? contactStyles.background(colors) : '#f3f4f6',
      // Subtle background pattern
      backgroundImage: `radial-gradient(circle at 10% 10%, ${colors.primary}0A, transparent 50%), radial-gradient(circle at 90% 90%, ${colors.accent}0A, transparent 50%)`
    };
    const contactTitleStyle = { color: contactStyles ? contactStyles.titleColor(colors) : colors.primary };
    const contactCardStyle = {
      backgroundColor: contactStyles ? contactStyles.cardBackground(colors) : '#ffffff',
      borderRadius: cardStyle.borderRadius, // Consistent card rounding
      border: cardStyle.border, // Consistent border
      boxShadow: cardStyle.boxShadow, // Ensure boxShadow is used
    };
    const getContactIconStyle = (type: 'primary' | 'accent' | 'secondary') => ({
      backgroundColor: contactStyles ? contactStyles.iconBackground(colors, type) : `${colors.primary}20`,
      borderRadius: primaryButtonStyle.borderRadius === '0px' ? '0px' : '9999px', // Match button rounding
    });
    const contactTextStyle = { color: contactStyles ? contactStyles.textColor(colors) : '#6b7280' };
    const getServiceAreaTagStyle = (index: number) => ({
      backgroundColor: contactStyles ? contactStyles.serviceAreaTagBackground(colors, index) : [`${colors.primary}15`, `${colors.accent}15`, `${colors.secondary}15`][index % 3],
      color: contactStyles ? contactStyles.serviceAreaTagColor(colors, index) : [colors.primary, colors.accent, colors.secondary][index % 3],
      // Apply rounding consistent with buttons/links
      borderRadius: primaryButtonStyle.borderRadius === '0px' ? '0px' : '9999px' 
    });

    // --- Data Fetching ---
    // Fetch inventory items for the "Popular Rentals" section.
    const inventoryItems = await prisma.inventory.findMany({
      where: { businessId: business.id, status: "AVAILABLE" },
      select: { id: true, name: true, description: true, price: true, primaryImage: true, type: true },
      take: 3,
    });

    const typeEmojis: Record<string, string> = {
      'BOUNCE_HOUSE': '🏰', 'INFLATABLE': '🌊', 'GAME': '🎮', 'OTHER': '🎉',
    };

    // --- Render Page --- 
    return (
      // Base background color from theme or default white
      <div className="min-h-screen" style={{ background: colors.background || '#ffffff' }}>
        {/* HERO SECTION - Styles derived from theme */}
        <section 
          className="py-20 md:py-28 overflow-hidden relative"
          // Hero background and text colors from theme
          style={{ background: heroBg, color: heroTextColor }} 
        >
          {/* Decorative elements - Could be made themeable later */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -mr-36 -mt-36 opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48 opacity-30"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2 space-y-8">
                <h1 
                  className="text-5xl md:text-7xl font-bold leading-tight tracking-tight drop-shadow-md"
                  // Hero title color from theme
                  style={{ color: heroTitleColor }} 
                >
                  {siteConfig.hero?.title || `Bounce Into Fun With ${business.name}!`} 
                </h1>
                <p className="text-xl md:text-2xl opacity-95 font-light">
                  {siteConfig.hero?.description || 'Premium inflatable rentals for birthdays, events, and parties. Making memories that last a lifetime!'}
                </p>
                <div className="flex flex-wrap gap-5 pt-6">
                  {/* Primary action button - Uses primaryButtonStyle from theme */}
                  <Button
                    asChild
                    size="lg" 
                    className="text-lg font-bold shadow-lg"
                    style={primaryButtonStyle} // Applied pre-calculated style
                  >
                    <Link href="/booking" className="flex items-center gap-2 transition-all duration-300 hover:scale-105">
                      Book Now <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  {/* Secondary action button - Uses secondaryButtonStyle from theme */}
                  <Button 
                    asChild
                    size="lg" 
                    
                    className="text-lg font-bold transition-all duration-300 hover:scale-105" // Removed potentially conflicting classes
                    style={secondaryButtonStyle} // Applied pre-calculated style
                  >
                    <Link href="/inventory">View Inflatables</Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 mt-10 md:mt-0">
                 {/* Hero Image - Applies imageStyles from theme */}
                <div 
                  className="p-3 shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500 hover:scale-105"
                  // Apply imageStyles (border, radius, shadow) directly
                  style={heroImageStyle} 
                >
                  <img 
                    src={siteConfig.hero?.imageUrl || '/images/hero-image.jpg'}
                    alt="Bounce House Fun" 
                    // Apply matching border-radius to image itself
                    className="rounded-2xl w-full h-72 md:h-[450px] object-cover" 
                    style={{ borderRadius: heroImageStyle.borderRadius}} 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* TRUST INDICATORS SECTION - Using theme colors */}
        <section className="py-8" style={{ background: colors.background }}>
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 py-2">
              <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                <div className="flex">
                  {/* Stars colored with primary theme color */}
                  {[...Array(5)].map((_, i) => 
                    <Star key={i} className="h-6 w-6" style={{ fill: colors.primary, color: colors.primary }} />
                  )}
                </div>
                <span className="ml-2 font-bold" style={{ color: colors.primary }}>Trusted by 500+ Customers</span>
              </div>
              <div className="h-8 border-r border-gray-300 hidden md:block"></div>
              <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                {/* Sparkles colored with secondary theme color */}
                <Sparkles className="h-6 w-6" style={{ color: colors.secondary }} />
                <span className="font-bold" style={{ color: colors.secondary }}>100% Clean Equipment</span>
              </div>
              <div className="h-8 border-r border-gray-300 hidden md:block"></div>
              <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                {/* Truck colored with accent theme color */}
                <Truck className="h-6 w-6" style={{ color: colors.accent }} />
                <span className="font-bold" style={{ color: colors.accent }}>Free Delivery & Setup</span>
              </div>
            </div>
          </div>
        </section>
        {/* FEATURES SECTION - Styles derived from theme */}
        <section className="py-20" style={{ background: colors.background }}>
          <div className="container mx-auto px-4">
            <h2 
              className="text-3xl md:text-5xl font-bold text-center mb-16"
              // Feature title style from theme
              style={featureTitleStyle} 
            >
              Why Choose Our Bounce Houses?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[ /* Feature data */
                { icon: '🧼', title: 'Clean & Safe', description: 'Thorough cleaning for every rental.' },
                { icon: '🎉', title: 'Fun for Everyone', description: 'Bounce houses for kids and adults.' },
                { icon: '🚚', title: 'Free Delivery', description: 'We handle setup and pickup.' }
              ].map((feature, index) => (
                <div 
                  key={index}
                  // Apply consistent card styles + theme-specific feature card background
                  className="p-8 text-center hover:shadow-xl transition-transform duration-300 hover:-translate-y-2"
                  style={getFeatureCardStyle(index)} 
                >
                  <div 
                    // Icon background style and rounding from theme
                    className="w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg"
                    style={getFeatureIconStyle(index)} 
                  >
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  <h3 
                    className="text-2xl font-bold mb-3"
                    // Feature card title style from theme
                    style={getFeatureCardTitleStyle(index)} 
                  >
                    {feature.title}
                  </h3>
                  <p 
                    className="text-lg"
                    // Feature card text style from theme
                    style={featureCardTextStyle} 
                  >
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* DYNAMIC LANDING SECTIONS - Rendered via SectionRenderer */}
        {siteConfig.landing?.sections?.map((section: DynamicSection) => (
          <section key={section.id} className="dynamic-section" style={{ background: section.backgroundColor }}>
            {/* Removed theme and colors props */}
            <SectionRenderer section={section} theme={theme} colors={colors} /> 
          </section>
        ))}
        {/* POPULAR RENTALS SECTION - Styles derived from theme */}
        <section 
          className="py-20 relative overflow-hidden"
          // Apply theme style conditionally
          style={popularRentalsStyles ? popularRentalsStyles.background(colors) : {}} 
        >
          <div className="container mx-auto px-4 relative z-10">
            <h2 
              className="text-3xl md:text-5xl font-bold text-center mb-16"
              // Popular rentals title style from theme
              style={popularRentalsTitleStyle} 
            >
              Our Most Popular Rentals
            </h2>
            {inventoryItems.length === 0 ? (
              <div className="text-center py-10 bg-white bg-opacity-70 rounded-2xl shadow-lg max-w-2xl mx-auto">
                <p className="text-gray-600 mb-8 text-xl">No inventory items available right now.</p>
                {/* Button uses primaryButtonStyle */}
                <Button asChild size="lg" className="text-lg font-bold hover:scale-105 transition-transform duration-300" style={primaryButtonStyle}>
                  <Link href="/booking" className="flex items-center gap-2">
                    Contact Us to Book <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {inventoryItems.map((item) => (
                  <div 
                    key={item.id} 
                    // Apply base card style from theme
                    className="bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-2 group"
                    style={popularCardStyle} 
                  >
                    <div 
                      // Card top background and rounding from theme
                      className="h-56 flex items-center justify-center overflow-hidden"
                      style={popularCardTopStyle} 
                    >
                      {item.primaryImage ? (
                        <img 
                          src={item.primaryImage} 
                          alt={item.name} 
                           // Apply theme image styles and card top rounding
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          style={{ ...theme.imageStyles(colors), ...popularCardImageStyle }} 
                        />
                      ) : (
                        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                          {typeEmojis[item.type] || '🎉'}
                        </span>
                      )}
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-bold mb-3" style={{color: cardStyle.color }}>{item.name}</h3>
                      <p className="mb-6 text-lg" style={{color: cardStyle.color }}>
                        {item.description || 'Perfect for any event or party!'}
                      </p>
                      <div className="flex justify-between items-center">
                        <span 
                          className="text-2xl font-bold"
                           // Price color from theme
                          style={popularPriceStyle} 
                        >
                          ${item.price}/day
                        </span>
                        {/* Button uses primaryButtonStyle */}
                        <Button asChild size="default" className="px-6 py-2 font-bold hover:scale-105 transition-transform duration-300" style={primaryButtonStyle}>
                          <Link href="/booking">Book Now</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="text-center mt-14">
               {/* Button uses primaryButtonStyle */}
              <Button asChild size="lg" className="text-lg font-bold hover:scale-105 transition-transform duration-300 shadow-lg" style={primaryButtonStyle}>
                <Link href="/inventory" className="flex items-center gap-2">
                  View All Inflatables <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          {/* Decorative elements - Could be themeable */}
          <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${colors.primary}1A, transparent 70%)` }}></div>
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${colors.accent}1A, transparent 70%)` }}></div>
        </section>
        {/* CTA SECTION - Styles derived from theme */}
        <section 
          className="py-20 relative overflow-hidden"
          // CTA background and text color from theme
          style={ctaSectionStyle} 
        >
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 
              className="text-4xl md:text-6xl font-bold mb-8 drop-shadow-md"
              // CTA title color from theme
              style={ctaTitleStyle} 
            >
              Ready to Make Your Event Unforgettable?
            </h2>
            <p 
              className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 opacity-95 font-light"
              // CTA text color from theme
              style={ctaTextStyle}
            >
              Book your bounce house today and create memories that will last a lifetime!
            </p>
            {/* Button uses primaryButtonStyle - Larger size */}
            <Button 
              asChild
              size="lg" 
              className="text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-10 py-7"
              style={secondaryButtonStyle} 
            >
              <Link href="/booking" className="flex items-center gap-3">
                Book Your Bounce House <ArrowRight className="h-6 w-6" />
              </Link>
            </Button>
          </div>
           {/* Decorative elements - Could be themeable */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40 opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48 opacity-20"></div>
        </section>
        {/* CONTACT SECTION - Styles derived from theme */}
        <section 
          className="py-20 relative overflow-hidden"
          // Contact section background from theme
          style={contactSectionBgStyle} 
        >
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Info Card - Uses theme card styles */}
              <div className="p-8 rounded-2xl shadow-lg" style={contactCardStyle}>
                <h2 
                  className="text-3xl font-bold mb-8"
                  // Contact title style from theme
                  style={contactTitleStyle} 
                >
                  Contact Us
                </h2>
                <div className="space-y-6">
                  {business.phone && (
                    <div className="flex items-start gap-4">
                      <div 
                        // Contact icon style from theme
                        className="w-12 h-12 rounded-full flex items-center justify-center mt-1 shadow-md"
                        style={getContactIconStyle('primary')} 
                      >
                        <span className="text-xl">📞</span>
                      </div>
                      <div>
                        <p className="font-bold text-lg" style={contactTitleStyle}>Phone:</p>
                        <p className="text-lg" style={contactTextStyle}>{business.phone}</p>
                      </div>
                    </div>
                  )}
                  {business.email && (
                    <div className="flex items-start gap-4">
                      <div 
                         // Contact icon style from theme
                        className="w-12 h-12 rounded-full flex items-center justify-center mt-1 shadow-md"
                        style={getContactIconStyle('accent')} 
                      >
                        <span className="text-xl">✉️</span>
                      </div>
                      <div>
                        <p className="font-bold text-lg" style={contactTitleStyle}>Email:</p>
                        <p className="text-lg" style={contactTextStyle}>{business.email}</p>
                      </div>
                    </div>
                  )}
                  {business.address && (
                    <div className="flex items-start gap-4">
                      <div 
                        // Contact icon style from theme
                        className="w-12 h-12 rounded-full flex items-center justify-center mt-1 shadow-md"
                        style={getContactIconStyle('secondary')} 
                      >
                        <span className="text-xl">📍</span>
                      </div>
                      <div>
                        <p className="font-bold text-lg" style={contactTitleStyle}>Address:</p>
                        <p className="text-lg" style={contactTextStyle}>
                          {business.address}, {business.city || ''} {business.state || ''} {business.zipCode || ''}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Service Areas Card - Uses theme card styles */}
              <div className="p-8 rounded-2xl shadow-lg" style={contactCardStyle}>
                <h2 
                  className="text-3xl font-bold mb-8"
                  // Contact title style from theme
                  style={contactTitleStyle} 
                >
                  Service Areas
                </h2>
                <p className="mb-6 text-lg" style={contactTextStyle}> 
                  We proudly serve the following areas and surrounding communities:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Array.isArray(business.serviceArea) && business.serviceArea.length > 0 ? (
                    business.serviceArea.map((area, index) => {
                      const cityName = area.split(',')[0].trim();
                      return (
                        <div 
                          key={area} 
                          // Service area tag style from theme
                          className="px-4 py-3 text-center font-medium shadow-sm hover:shadow-md transition-transform duration-300 hover:-translate-y-1"
                          style={getServiceAreaTagStyle(index)} 
                        >
                          {cityName}
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-3 text-center py-4 text-gray-500">
                      No service areas defined yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
           {/* Decorative elements - Could be themeable */}
          <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${colors.primary}1A, transparent 70%)` }}></div>
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${colors.accent}1A, transparent 70%)` }}></div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('Error fetching business by domain:', error);
    return notFound(); // Render 404 page on error
  }
}
