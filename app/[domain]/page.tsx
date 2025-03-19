import { notFound } from 'next/navigation';
import { getBusinessByDomain } from '@/lib/business/domain-utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight, Sparkles, Truck } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { domain: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const domain = decodeURIComponent(params.domain);
  
  try {
    // Get the business data
    const business = await getBusinessByDomain(domain);
    
    // Use business name as title
    const title = business.name;
    const description = business.description || 'Premium inflatable rentals for birthdays, events, and parties.';
    
    // Use hero title and description if available
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

export default async function DomainPage({ params }: { params: { domain: string } }) {
  console.log("Domain page rendered with domain:", params.domain);
  
  const domain = decodeURIComponent(params.domain);
  
  try {
    // Use the domain utils to find the business by either custom domain or subdomain
    const business = await getBusinessByDomain(domain);
  
    // Get the site configuration
    const siteConfig = business.siteConfig || {};
    const colors = siteConfig.colors || {};
    
    // Default modern, vibrant color scheme if none provided
    const primaryColor = colors.primary || '#4f46e5'; // Indigo
    const accentColor = colors.accent || '#f97316'; // Orange
    const tertiaryColor = colors.secondary || '#06b6d4'; // Cyan - not from config, just a default
    
    // Fetch available inventory items for this business
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
      take: 3, // Only get up to 3 items for the homepage
    });
    
    // Emoji mapping for inventory types
    const typeEmojis: Record<string, string> = {
      'BOUNCE_HOUSE': '🏰',
      'INFLATABLE': '🌊',
      'GAME': '🎮',
      'OTHER': '🎉',
    };
  
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section 
          className="py-20 md:py-28 overflow-hidden relative" 
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
            color: '#ffffff'
          }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -mr-36 -mt-36 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48"></div>
          <div className="absolute top-1/4 left-1/3 w-20 h-20 bg-white/10 rounded-full animate-bounce opacity-50"></div>
          <div className="absolute bottom-1/4 right-1/3 w-32 h-32 bg-white/10 rounded-full animate-pulse opacity-70"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2 space-y-8">
                <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight drop-shadow-md">
                  {siteConfig.hero?.title || `Bounce Into Fun With ${business.name}!`}
                </h1>
                <p className="text-xl md:text-2xl opacity-95 font-light">
                  {siteConfig.hero?.description || 'Premium inflatable rentals for birthdays, events, and parties. Making memories that last a lifetime!'}
                </p>
                <div className="flex flex-wrap gap-5 pt-6">
                  <Button 
                    size="lg" 
                    className="text-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    style={{ 
                      backgroundColor: accentColor,
                      color: '#ffffff'
                    }}
                  >
                    <Link href="/booking" className="flex items-center gap-2">
                      Book Now <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg font-bold bg-white/10 hover:bg-white/20 border-white text-white hover:scale-105 transition-all duration-300"
                  >
                    <Link href="/inventory">View Inflatables</Link>
                  </Button>
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
        
        {/* Trust Indicators */}
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
        
        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 
              className="text-3xl md:text-5xl font-bold text-center mb-16 text-gray-900"
              style={{ color: primaryColor }}
            >
              Why Choose Our Bounce Houses?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div 
                className="rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                style={{ backgroundColor: `${primaryColor}10` }}
              >
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <span className="text-3xl">🧼</span>
                </div>
                <h3 
                  className="text-2xl font-bold mb-3 text-gray-900"
                  style={{ color: primaryColor }}
                >
                  Clean & Safe
                </h3>
                <p className="text-gray-600 text-lg">
                  All our inflatables are thoroughly cleaned and sanitized before every rental for your peace of mind.
                </p>
              </div>
              
              <div 
                className="rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                style={{ backgroundColor: `${accentColor}10` }}
              >
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  <span className="text-3xl">🎉</span>
                </div>
                <h3 
                  className="text-2xl font-bold mb-3 text-gray-900"
                  style={{ color: accentColor }}
                >
                  Fun for Everyone
                </h3>
                <p className="text-gray-600 text-lg">
                  Our bounce houses are perfect for kids and adults of all ages - creating unforgettable experiences.
                </p>
              </div>
              
              <div 
                className="rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                style={{ backgroundColor: `${tertiaryColor}10` }}
              >
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  style={{ backgroundColor: `${tertiaryColor}20` }}
                >
                  <span className="text-3xl">🚚</span>
                </div>
                <h3 
                  className="text-2xl font-bold mb-3 text-gray-900"
                  style={{ color: tertiaryColor }}
                >
                  Free Delivery
                </h3>
                <p className="text-gray-600 text-lg">
                  We handle delivery, setup, and pickup for a completely hassle-free experience for your event.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Popular Rentals Section */}
        <section 
          className="py-20 relative overflow-hidden"
          style={{ 
            backgroundColor: '#f8fafc',
            backgroundImage: 'radial-gradient(circle at 20% 90%, rgba(79, 70, 229, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 40%, rgba(249, 115, 22, 0.05) 0%, transparent 50%)'
          }}
        >
          <div className="container mx-auto px-4 relative z-10">
            <h2 
              className="text-3xl md:text-5xl font-bold text-center mb-16 text-gray-900"
              style={{ color: primaryColor }}
            >
              Our Most Popular Rentals
            </h2>
            
            {inventoryItems.length === 0 ? (
              <div className="text-center py-10 bg-white bg-opacity-70 rounded-2xl shadow-lg max-w-2xl mx-auto">
                <p className="text-gray-600 mb-8 text-xl">No inventory items available at the moment.</p>
                <Button 
                  size="lg"
                  className="text-lg font-bold hover:scale-105 transition-all duration-300"
                  style={{ 
                    backgroundColor: primaryColor,
                    color: '#ffffff'
                  }}
                >
                  <Link href="/booking" className="flex items-center gap-2">
                    Contact Us to Book <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {inventoryItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                    <div 
                      className="h-56 flex items-center justify-center"
                      style={{ 
                        background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
                      }}
                    >
                      {item.primaryImage ? (
                        <img 
                          src={item.primaryImage} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                        />
                      ) : (
                        <span className="text-6xl group-hover:scale-110 transition-all duration-300">{typeEmojis[item.type] || '🎉'}</span>
                      )}
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-bold mb-3 text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 mb-6 text-lg">
                        {item.description || `Perfect for any event or party!`}
                      </p>
                      <div className="flex justify-between items-center">
                        <span 
                          className="text-2xl font-bold"
                          style={{ color: primaryColor }}
                        >
                          ${item.price}/day
                        </span>
                        <Button 
                          className="px-6 py-2 font-bold hover:scale-105 transition-all duration-300"
                          style={{ 
                            backgroundColor: accentColor,
                            color: '#ffffff'
                          }}
                        >
                          <Link href="/booking">Book Now</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-center mt-14">
              <Button 
                size="lg"
                className="text-lg font-bold hover:scale-105 transition-all duration-300 shadow-lg"
                style={{ 
                  backgroundColor: primaryColor,
                  color: '#ffffff'
                }}
              >
                <Link href="/inventory" className="flex items-center gap-2">
                  View All Inflatables <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full" style={{ background: `radial-gradient(circle, ${primaryColor}10 0%, transparent 70%)` }}></div>
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full" style={{ background: `radial-gradient(circle, ${accentColor}10 0%, transparent 70%)` }}></div>
        </section>
        
        {/* CTA Section */}
        <section 
          className="py-20 text-white relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
          }}
        >
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 drop-shadow-md">Ready to Make Your Event Unforgettable?</h2>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 opacity-95 font-light">
              Book your bounce house today and create memories that will last a lifetime!
            </p>
            <Button 
              size="lg" 
              className="text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-10 py-7"
              style={{ 
                backgroundColor: '#ffffff',
                color: primaryColor
              }}
            >
              <Link href="/booking" className="flex items-center gap-3">
                Book Your Bounce House <ArrowRight className="h-6 w-6" />
              </Link>
            </Button>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48"></div>
          <div className="absolute bottom-20 right-1/4 w-24 h-24 bg-white/10 rounded-full animate-bounce opacity-60"></div>
          <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-white/10 rounded-full animate-pulse opacity-40"></div>
        </section>
        
        {/* Contact Info */}
        <section 
          className="py-20 bg-gray-50 relative overflow-hidden"
          style={{ 
            backgroundImage: 'radial-gradient(circle at 10% 10%, rgba(79, 70, 229, 0.05) 0%, transparent 50%), radial-gradient(circle at 90% 90%, rgba(249, 115, 22, 0.05) 0%, transparent 50%)'
          }}
        >
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h2 
                  className="text-3xl font-bold mb-8 text-gray-900"
                  style={{ color: primaryColor }}
                >
                  Contact Us
                </h2>
                <div className="space-y-6">
                  {business.phone && (
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center mt-1 shadow-md"
                        style={{ backgroundColor: `${primaryColor}20` }}
                      >
                        <span className="text-xl">📞</span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">Phone:</p>
                        <p className="text-gray-600 text-lg">{business.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {business.email && (
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center mt-1 shadow-md"
                        style={{ backgroundColor: `${accentColor}20` }}
                      >
                        <span className="text-xl">✉️</span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">Email:</p>
                        <p className="text-gray-600 text-lg">{business.email}</p>
                      </div>
                    </div>
                  )}
                  
                  {business.address && (
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center mt-1 shadow-md"
                        style={{ backgroundColor: `${tertiaryColor}20` }}
                      >
                        <span className="text-xl">📍</span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">Address:</p>
                        <p className="text-gray-600 text-lg">
                          {business.address}, {business.city || ''} {business.state || ''} {business.zipCode || ''}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h2 
                  className="text-3xl font-bold mb-8 text-gray-900"
                  style={{ color: primaryColor }}
                >
                  Service Areas
                </h2>
                <p className="text-gray-600 mb-6 text-lg">
                  We proudly serve the following areas and surrounding communities:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['Phoenix', 'Scottsdale', 'Tempe', 'Mesa', 'Chandler', 'Gilbert', 'Glendale', 'Peoria'].map((city, index) => (
                    <div 
                      key={city} 
                      className="px-4 py-3 rounded-xl text-center font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                      style={{ 
                        backgroundColor: index % 3 === 0 ? `${primaryColor}15` : 
                                        index % 3 === 1 ? `${accentColor}15` : 
                                        `${tertiaryColor}15`,
                        color: index % 3 === 0 ? primaryColor : 
                              index % 3 === 1 ? accentColor : 
                              tertiaryColor
                      }}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full" style={{ background: `radial-gradient(circle, ${primaryColor}05 0%, transparent 70%)` }}></div>
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full" style={{ background: `radial-gradient(circle, ${accentColor}05 0%, transparent 70%)` }}></div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('Error fetching business by domain:', error);
    return notFound();
  }
}