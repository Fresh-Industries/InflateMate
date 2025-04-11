import { notFound } from 'next/navigation';
import { DynamicSection, getBusinessByDomain } from '@/lib/business/domain-utils';
import Link from 'next/link';
import { Star, ArrowRight, Sparkles, Truck } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import SectionRenderer from './_components/SectionRenderer';
import { themeConfig, ThemeDefinition, ThemeColors } from '@/app/[domain]/_themes/themeConfig';
import ThemedButton from '@/app/[domain]/_components/ui/ThemeButton';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { domain: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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

export default async function DomainPage({ params }: { params: Promise<{ domain: string }> }) {
  const domain = decodeURIComponent((await params).domain);
  
  try {
    const business = await getBusinessByDomain(domain);
    const siteConfig = business.siteConfig || {};
    // Get the theme name from config, default to 'modern'
    const themeNameFromConfig: string | null | undefined = siteConfig.themeName as string | undefined; // Assume themeName is string or undefined/null
    const rawThemeName = themeNameFromConfig || 'modern';
    // Ensure the themeName is a valid key in themeConfig using Object.keys
    const themeName = (Object.keys(themeConfig).includes(rawThemeName)) ? rawThemeName : 'modern';
    // Look up the theme definition from the config object
    const theme: ThemeDefinition = themeConfig[themeName];
    // Colors provided by the business site config (or fallback defaults)
    const colors: ThemeColors = {
      primary: siteConfig.colors?.primary || '#4f46e5', // Indigo
      accent: siteConfig.colors?.accent || '#f97316', // Orange
      secondary: siteConfig.colors?.secondary || '#06b6d4' // Cyan
    };

    const landingSections: DynamicSection[] = siteConfig.landing?.sections || [];
    console.log("landingSections", landingSections);
    
    const inventoryItems = await prisma.inventory.findMany({
      where: {
        businessId: business.id,
        status: "AVAILABLE",
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        primaryImage: true,
        type: true,
      },
      take: 3,
    });
    
    const typeEmojis: Record<string, string> = {
      'BOUNCE_HOUSE': '🏰',
      'INFLATABLE': '🌊',
      'GAME': '🎮',
      'OTHER': '🎉',
    };

    // Get theme style functions
    const heroBg = theme.heroBackground ? theme.heroBackground(colors) : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`;
    const heroTitleColor = theme.heroTitleColor ? theme.heroTitleColor(colors) : '#ffffff';
    const heroTextColor = theme.heroTextColor ? theme.heroTextColor(colors) : '#ffffff';
    const featureStyles = theme.featureSectionStyles;
    const popularRentalsStyles = theme.popularRentalsStyles;
    const ctaStyles = theme.ctaStyles;
    const contactStyles = theme.contactStyles;

    return (
      <div className="min-h-screen bg-white">
        {/* HERO SECTION */}
        <section 
          className="py-20 md:py-28 overflow-hidden relative" 
          style={{ 
            background: heroBg,
            color: heroTextColor
          }}
        >
          {/* Theme-inspired decorative elements */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -mr-36 -mt-36 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48"></div>
          <div className="absolute top-1/4 left-1/3 w-20 h-20 bg-white/10 rounded-full animate-bounce opacity-50"></div>
          <div className="absolute bottom-1/4 right-1/3 w-32 h-32 bg-white/10 rounded-full animate-pulse opacity-70"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2 space-y-8">
                <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight drop-shadow-md" style={{ color: heroTitleColor }}>
                  {siteConfig.hero?.title || `Bounce Into Fun With ${business.name}!`}
                </h1>
                <p className="text-xl md:text-2xl opacity-95 font-light">
                  {siteConfig.hero?.description || 'Premium inflatable rentals for birthdays, events, and parties. Making memories that last a lifetime!'}
                </p>
                <div className="flex flex-wrap gap-5 pt-6">
                  {/* Using ThemedButton in place of Button */}
                  <ThemedButton 
                    asChild
                    size="lg" 
                    theme={theme} 
                    colors={colors} 
                    className="text-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    <Link href="/booking" className="flex items-center gap-2">
                      Book Now <ArrowRight className="h-5 w-5" />
                    </Link>
                  </ThemedButton>
                  <ThemedButton 
                    asChild
                    size="lg" 
                    theme={theme} 
                    colors={colors} 
                    variant="outline"
                    className="text-lg font-bold bg-transparent hover:bg-white/10 border-white text-white hover:text-white hover:scale-105 transition-all duration-300"
                  >
                    <Link href="/inventory">View Inflatables</Link>
                  </ThemedButton>
                </div>
              </div>
              <div className="md:w-1/2 mt-10 md:mt-0">
                <div className="bg-white p-3 rounded-3xl shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500 hover:scale-105">
                  <img 
                    src={siteConfig.hero?.imageUrl || '/images/hero-image.jpg'}
                    alt="Bounce House Fun" 
                    className="rounded-2xl w-full h-72 md:h-[450px] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* TRUST INDICATORS */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 py-2">
              <div className="flex items-center gap-2 hover:scale-105 transition-all duration-300">
                <div className="flex">
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                </div>
                <span className="ml-2 font-bold text-gray-900">Trusted by 500+ Customers</span>
              </div>
              <div className="h-8 border-r border-gray-300 hidden md:block"></div>
              <div className="flex items-center gap-2 hover:scale-105 transition-all duration-300">
                <Sparkles className="h-6 w-6 text-blue-500" />
                <span className="font-bold text-gray-900">100% Clean Equipment</span>
              </div>
              <div className="h-8 border-r border-gray-300 hidden md:block"></div>
              <div className="flex items-center gap-2 hover:scale-105 transition-all duration-300">
                <Truck className="h-6 w-6 text-green-500" />
                <span className="font-bold text-gray-900">Free Delivery & Setup</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* FEATURES SECTION */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 
              className="text-3xl md:text-5xl font-bold text-center mb-16"
              style={{ color: featureStyles ? featureStyles.titleColor(colors) : colors.primary }}
            >
              Why Choose Our Bounce Houses?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div 
                className="rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                style={{ backgroundColor: featureStyles ? featureStyles.cardBackground(colors, 0) : `${colors.primary}10` }}
              >
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  style={{ backgroundColor: featureStyles ? featureStyles.iconBackground(colors, 0) : `${colors.primary}20` }}
                >
                  <span className="text-3xl">🧼</span>
                </div>
                <h3 
                  className="text-2xl font-bold mb-3"
                  style={{ color: featureStyles ? featureStyles.cardTitleColor(colors, 0) : colors.primary }}
                >
                  Clean & Safe
                </h3>
                <p className="text-lg" style={{ color: featureStyles ? featureStyles.cardTextColor(colors) : '#6b7280' }}>
                  Thorough cleaning and sanitization for every rental.
                </p>
              </div>
              
              <div 
                className="rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                style={{ backgroundColor: featureStyles ? featureStyles.cardBackground(colors, 1) : `${colors.accent}10` }}
              >
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  style={{ backgroundColor: featureStyles ? featureStyles.iconBackground(colors, 1) : `${colors.accent}20` }}
                >
                  <span className="text-3xl">🎉</span>
                </div>
                <h3 
                  className="text-2xl font-bold mb-3"
                  style={{ color: featureStyles ? featureStyles.cardTitleColor(colors, 1) : colors.accent }}
                >
                  Fun for Everyone
                </h3>
                <p className="text-lg" style={{ color: featureStyles ? featureStyles.cardTextColor(colors) : '#6b7280' }}>
                  Bounce houses that bring smiles to kids and adults alike.
                </p>
              </div>
              
              <div 
                className="rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                style={{ backgroundColor: featureStyles ? featureStyles.cardBackground(colors, 2) : `${colors.secondary}10` }}
              >
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  style={{ backgroundColor: featureStyles ? featureStyles.iconBackground(colors, 2) : `${colors.secondary}20` }}
                >
                  <span className="text-3xl">🚚</span>
                </div>
                <h3 
                  className="text-2xl font-bold mb-3"
                  style={{ color: featureStyles ? featureStyles.cardTitleColor(colors, 2) : colors.secondary }}
                >
                  Free Delivery
                </h3>
                <p className="text-lg" style={{ color: featureStyles ? featureStyles.cardTextColor(colors) : '#6b7280' }}>
                  We handle setup, delivery, and pickup for a hassle-free event.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* LANDING SECTIONS (Dynamic Content) */}
        {landingSections.map((section) => (
          <section key={section.id} className="dynamic-section">
            <SectionRenderer section={section} />
          </section>
        ))}
        
        {/* POPULAR RENTALS SECTION */}
        <section 
          className="py-20 relative overflow-hidden"
          style={{ 
            backgroundColor: popularRentalsStyles ? popularRentalsStyles.background(colors) : '#f8fafc',
            backgroundImage: `radial-gradient(circle at 20% 90%, ${colors.primary}0D 0%, transparent 50%), radial-gradient(circle at 80% 40%, ${colors.accent}0D 0%, transparent 50%)`
          }}
        >
          <div className="container mx-auto px-4 relative z-10">
            <h2 
              className="text-3xl md:text-5xl font-bold text-center mb-16"
              style={{ color: popularRentalsStyles ? popularRentalsStyles.titleColor(colors) : colors.primary }}
            >
              Our Most Popular Rentals
            </h2>
            
            {inventoryItems.length === 0 ? (
              <div className="text-center py-10 bg-white bg-opacity-70 rounded-2xl shadow-lg max-w-2xl mx-auto">
                <p className="text-gray-600 mb-8 text-xl">No inventory items available right now.</p>
                <ThemedButton 
                  size="lg"
                  theme={theme}
                  colors={colors}
                  className="text-lg font-bold hover:scale-105 transition-all duration-300"
                >
                  <Link href="/booking" className="flex items-center gap-2">
                    Contact Us to Book <ArrowRight className="h-5 w-5" />
                  </Link>
                </ThemedButton>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {inventoryItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                    <div 
                      className="h-56 flex items-center justify-center overflow-hidden"
                      style={{ 
                        background: popularRentalsStyles ? popularRentalsStyles.cardBackgroundGradient(colors) : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                      }}
                    >
                      {item.primaryImage ? (
                        <img 
                          src={item.primaryImage} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                        />
                      ) : (
                        <span className="text-6xl group-hover:scale-110 transition-all duration-300">
                          {typeEmojis[item.type] || '🎉'}
                        </span>
                      )}
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-bold mb-3 text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 mb-6 text-lg">
                        {item.description || 'Perfect for any event or party!'}
                      </p>
                      <div className="flex justify-between items-center">
                        <span 
                          className="text-2xl font-bold"
                          style={{ color: popularRentalsStyles ? popularRentalsStyles.priceColor(colors) : colors.primary }}
                        >
                          ${item.price}/day
                        </span>
                        <ThemedButton 
                          size="default"
                          theme={theme}
                          colors={colors}
                          className="px-6 py-2 font-bold hover:scale-105 transition-all duration-300"
                        >
                          <Link href="/booking">Book Now</Link>
                        </ThemedButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-center mt-14">
              <ThemedButton 
                size="lg"
                theme={theme}
                colors={colors}
                className="text-lg font-bold hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <Link href="/inventory" className="flex items-center gap-2">
                  View All Inflatables <ArrowRight className="h-5 w-5" />
                </Link>
              </ThemedButton>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full" style={{ background: `radial-gradient(circle, ${colors.primary}1A 0%, transparent 70%)` }}></div>
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full" style={{ background: `radial-gradient(circle, ${colors.accent}1A 0%, transparent 70%)` }}></div>
        </section>
        
        {/* CTA SECTION */}
        <section 
          className="py-20 relative overflow-hidden"
          style={{ 
            background: ctaStyles ? ctaStyles.background(colors) : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
            color: ctaStyles ? ctaStyles.textColor(colors) : '#ffffff',
          }}
        >
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 drop-shadow-md" style={{ color: ctaStyles ? ctaStyles.titleColor(colors) : '#ffffff' }}>
              Ready to Make Your Event Unforgettable?
            </h2>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 opacity-95 font-light">
              Book your bounce house today and create memories that will last a lifetime!
            </p>
            <ThemedButton 
              size="lg" 
              theme={theme}
              colors={colors}
              className="text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-10 py-7"
            >
              <Link href="/booking" className="flex items-center gap-3">
                Book Your Bounce House <ArrowRight className="h-6 w-6" />
              </Link>
            </ThemedButton>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48"></div>
          <div className="absolute bottom-20 right-1/4 w-24 h-24 bg-white/10 rounded-full animate-bounce opacity-60"></div>
          <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-white/10 rounded-full animate-pulse opacity-40"></div>
        </section>
        
        {/* CONTACT INFO SECTION */}
        <section 
          className="py-20 relative overflow-hidden"
          style={{ 
            background: contactStyles ? contactStyles.background(colors) : '#f3f4f6',
            backgroundImage: `radial-gradient(circle at 10% 10%, ${colors.primary}0D 0%, transparent 50%), radial-gradient(circle at 90% 90%, ${colors.accent}0D 0%, transparent 50%)`
          }}
        >
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="p-8 rounded-2xl shadow-lg" style={{ backgroundColor: contactStyles ? contactStyles.cardBackground(colors) : '#ffffff' }}>
                <h2 
                  className="text-3xl font-bold mb-8"
                  style={{ color: contactStyles ? contactStyles.titleColor(colors) : colors.primary }}
                >
                  Contact Us
                </h2>
                <div className="space-y-6">
                  {business.phone && (
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center mt-1 shadow-md"
                        style={{ backgroundColor: contactStyles ? contactStyles.iconBackground(colors, 'primary') : `${colors.primary}20` }}
                      >
                        <span className="text-xl">📞</span>
                      </div>
                      <div>
                        <p className="font-bold text-lg" style={{ color: contactStyles ? contactStyles.titleColor(colors) : colors.primary }}>Phone:</p>
                        <p className="text-lg" style={{ color: contactStyles ? contactStyles.textColor(colors) : '#6b7280' }}>{business.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {business.email && (
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center mt-1 shadow-md"
                        style={{ backgroundColor: contactStyles ? contactStyles.iconBackground(colors, 'accent') : `${colors.accent}20` }}
                      >
                        <span className="text-xl">✉️</span>
                      </div>
                      <div>
                        <p className="font-bold text-lg" style={{ color: contactStyles ? contactStyles.titleColor(colors) : colors.primary }}>Email:</p>
                        <p className="text-lg" style={{ color: contactStyles ? contactStyles.textColor(colors) : '#6b7280' }}>{business.email}</p>
                      </div>
                    </div>
                  )}
                  
                  {business.address && (
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center mt-1 shadow-md"
                        style={{ backgroundColor: contactStyles ? contactStyles.iconBackground(colors, 'secondary') : `${colors.secondary}20` }}
                      >
                        <span className="text-xl">📍</span>
                      </div>
                      <div>
                        <p className="font-bold text-lg" style={{ color: contactStyles ? contactStyles.titleColor(colors) : colors.primary }}>Address:</p>
                        <p className="text-lg" style={{ color: contactStyles ? contactStyles.textColor(colors) : '#6b7280' }}>
                          {business.address}, {business.city || ''} {business.state || ''} {business.zipCode || ''}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-8 rounded-2xl shadow-lg" style={{ backgroundColor: contactStyles ? contactStyles.cardBackground(colors) : '#ffffff' }}>
                <h2 
                  className="text-3xl font-bold mb-8"
                  style={{ color: contactStyles ? contactStyles.titleColor(colors) : colors.primary }}
                >
                  Service Areas
                </h2>
                <p className="text-gray-600 mb-6 text-lg">
                  We proudly serve the following areas and surrounding communities:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Array.isArray(business.serviceArea) && business.serviceArea.length > 0 ? (
                    business.serviceArea.map((area, index) => {
                      const cityName = area.split(',')[0].trim();
                      return (
                        <div 
                          key={area} 
                          className="px-4 py-3 rounded-xl text-center font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                          style={{
                            backgroundColor: contactStyles ? contactStyles.serviceAreaTagBackground(colors, index) : [`${colors.primary}15`, `${colors.accent}15`, `${colors.secondary}15`][index % 3],
                            color: contactStyles ? contactStyles.serviceAreaTagColor(colors, index) : [colors.primary, colors.accent, colors.secondary][index % 3]
                          }}
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
          
          {/* Decorative elements for contact section - Use theme colors */}
          <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full" style={{ background: `radial-gradient(circle, ${colors.primary}0D 0%, transparent 70%)` }}></div>
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full" style={{ background: `radial-gradient(circle, ${colors.accent}0D 0%, transparent 70%)` }}></div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('Error fetching business by domain:', error);
    return notFound();
  }
}
