import { notFound } from 'next/navigation';
import { getBusinessByDomain } from '@/lib/business/domain-utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight } from 'lucide-react';
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
  const domain = decodeURIComponent(params.domain);
  console.log('Domain page rendered with domain:', domain);
  
  try {
    // Use the domain utils to find the business by either custom domain or subdomain
    const business = await getBusinessByDomain(domain);
  
  // Get the site configuration
  const siteConfig = business.siteConfig || {};
    const colors = siteConfig.colors || {};
    
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
          className="py-16 md:py-24 overflow-hidden relative"
          style={{ 
            background: `linear-gradient(135deg, ${colors.primary || '#3b82f6'} 0%, ${colors.accent || '#f59e0b'} 100%)`,
            color: '#ffffff'
          }}
        >
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  {siteConfig.hero?.title || `Bounce Into Fun With ${business.name}!`}
                </h1>
                <p className="text-xl md:text-2xl opacity-90">
                  {siteConfig.hero?.description || 'Premium inflatable rentals for birthdays, events, and parties. Making memories that last a lifetime!'}
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button 
                    size="lg" 
                    className="text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                    style={{ 
                      backgroundColor: colors.accent || '#f59e0b',
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
                    className="text-lg font-bold bg-white/10 hover:bg-white/20 border-white text-white"
                  >
                    <Link href="/inventory">View Inflatables</Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 mt-8 md:mt-0">
                <div className="bg-white p-3 rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-300">
                  <img 
                    src={siteConfig.hero?.imageUrl || '/images/hero-image.jpg'}
                    alt="Bounce House Fun" 
                    className="rounded-xl w-full h-64 md:h-96 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48"></div>
        </section>
        
        {/* Trust Indicators */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="ml-2 font-medium text-gray-900">Trusted by 500+ Customers</span>
              </div>
              <div className="h-6 border-r border-gray-300 hidden md:block"></div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">100% Clean Equipment</span>
              </div>
              <div className="h-6 border-r border-gray-300 hidden md:block"></div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">Free Delivery & Setup</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900"
              style={{ color: colors.primary || '#3b82f6' }}
            >
              Why Choose Our Bounce Houses?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div 
                className="rounded-xl p-6 text-center hover:shadow-xl transition-all"
                style={{ backgroundColor: `${colors.primary}10` || '#3b82f610' }}
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${colors.primary}20` || '#3b82f620' }}
                >
                  <span className="text-2xl">🧼</span>
                </div>
                <h3 
                  className="text-xl font-bold mb-2 text-gray-900"
                  style={{ color: colors.primary || '#3b82f6' }}
                >
                  Clean & Safe
                </h3>
                <p className="text-gray-600">
                  All our inflatables are thoroughly cleaned and sanitized before every rental.
                </p>
              </div>
              
              <div 
                className="rounded-xl p-6 text-center hover:shadow-xl transition-all"
                style={{ backgroundColor: `${colors.primary}10` || '#3b82f610' }}
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${colors.primary}20` || '#3b82f620' }}
                >
                  <span className="text-2xl">🎉</span>
                </div>
                <h3 
                  className="text-xl font-bold mb-2 text-gray-900"
                  style={{ color: colors.primary || '#3b82f6' }}
                >
                  Fun for Everyone
                </h3>
                <p className="text-gray-600">
                  Our bounce houses are perfect for kids and adults of all ages.
                </p>
              </div>
              
              <div 
                className="rounded-xl p-6 text-center hover:shadow-xl transition-all"
                style={{ backgroundColor: `${colors.primary}10` || '#3b82f610' }}
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${colors.primary}20` || '#3b82f620' }}
                >
                  <span className="text-2xl">🚚</span>
                </div>
                <h3 
                  className="text-xl font-bold mb-2 text-gray-900"
                  style={{ color: colors.primary || '#3b82f6' }}
                >
                  Free Delivery
                </h3>
                <p className="text-gray-600">
                  We handle delivery, setup, and pickup for a hassle-free experience.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Popular Rentals Section */}
        <section 
          className="py-16 bg-gray-50 border-t border-b"
        >
          <div className="container mx-auto px-4">
            <h2 
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900"
              style={{ color: colors.primary || '#3b82f6' }}
            >
              Our Most Popular Rentals
            </h2>
            
            {inventoryItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-6">No inventory items available at the moment.</p>
                <Button 
                  size="lg"
                  style={{ 
                    backgroundColor: colors.primary || '#3b82f6',
                    color: '#ffffff'
                  }}
                >
                  <Link href="/booking" className="flex items-center gap-2">
                    Contact Us to Book <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {inventoryItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                    <div 
                      className="h-48 flex items-center justify-center"
                      style={{ 
                        background: `linear-gradient(135deg, ${colors.primary || '#3b82f6'} 0%, ${colors.accent || '#f59e0b'} 100%)`,
                      }}
                    >
                      {item.primaryImage ? (
                        <img 
                          src={item.primaryImage} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-5xl">{typeEmojis[item.type] || '🎉'}</span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 mb-4">
                        {item.description || `Perfect for any event or party!`}
                      </p>
                      <div className="flex justify-between items-center">
                        <span 
                          className="text-xl font-bold"
                          style={{ color: colors.primary || '#3b82f6' }}
                        >
                          ${item.price}/day
                        </span>
                        <Button 
                          size="sm"
                          style={{ 
                            backgroundColor: colors.accent || '#f59e0b',
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
            
            <div className="text-center mt-10">
              <Button 
                size="lg"
                style={{ 
                  backgroundColor: colors.primary || '#3b82f6',
                  color: '#ffffff'
                }}
              >
                <Link href="/inventory" className="flex items-center gap-2">
                  View All Inflatables <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900"
              style={{ color: colors.primary || '#3b82f6' }}
            >
              What Our Customers Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border">
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 text-xl">★★★★★</div>
                </div>
                <p className="text-gray-600 mb-4">&ldquo;The kids had an absolute blast! The bounce house was clean, the delivery was on time, and pickup was hassle-free.&rdquo;</p>
                <p className="font-bold text-gray-900">- Sarah M.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border">
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 text-xl">★★★★★</div>
                </div>
                <p className="text-gray-600 mb-4">&ldquo;We rented the water slide for our summer party and it was the highlight of the event. Excellent service!&rdquo;</p>
                <p className="font-bold text-gray-900">- Michael T.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border">
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 text-xl">★★★★★</div>
                </div>
                <p className="text-gray-600 mb-4">&ldquo;Professional, punctual, and the bounce house was in perfect condition. Will definitely rent again!&rdquo;</p>
                <p className="font-bold text-gray-900">- Jessica K.</p>
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
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Make Your Event Unforgettable?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8 opacity-90">
              Book your bounce house today and create memories that will last a lifetime!
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
                Book Your Bounce House <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48"></div>
        </section>
        
        {/* Contact Info */}
        <section 
          className="py-16 bg-gray-50"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 
                  className="text-3xl font-bold mb-6 text-gray-900"
                  style={{ color: colors.primary || '#3b82f6' }}
                >
                  Contact Us
                </h2>
                <div className="space-y-4">
                  {business.phone && (
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center mt-1"
                        style={{ backgroundColor: `${colors.primary}20` || '#3b82f620' }}
                      >
                        <span className="text-lg">📞</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Phone:</p>
                        <p className="text-gray-600">{business.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {business.email && (
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center mt-1"
                        style={{ backgroundColor: `${colors.primary}20` || '#3b82f620' }}
                      >
                        <span className="text-lg">✉️</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Email:</p>
                        <p className="text-gray-600">{business.email}</p>
                      </div>
                    </div>
                  )}
                  
                  {business.address && (
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center mt-1"
                        style={{ backgroundColor: `${colors.primary}20` || '#3b82f620' }}
                      >
                        <span className="text-lg">📍</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Address:</p>
                        <p className="text-gray-600">
                          {business.address}, {business.city || ''} {business.state || ''} {business.zipCode || ''}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
      </div>
      
              <div>
                <h2 
                  className="text-3xl font-bold mb-6 text-gray-900"
                  style={{ color: colors.primary || '#3b82f6' }}
                >
                  Service Areas
                </h2>
                <p className="text-gray-600 mb-4">
                  We proudly serve the following areas and surrounding communities:
                </p>
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
              </div>
            </div>
      </div>
        </section>
    </div>
  );
  } catch (error) {
    console.error('Error fetching business by domain:', error);
    return notFound();
  }
}