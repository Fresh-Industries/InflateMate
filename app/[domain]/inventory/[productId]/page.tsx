import { notFound } from 'next/navigation';
import { getBusinessByDomain } from '@/lib/business/domain-utils';
import { prisma } from '@/lib/prisma';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Package, 
  Clock, 
  Info, 
  ArrowLeft, 
  Star, 
  Shield, 
  Zap, 
  Users, 
  Ruler, 
  Weight, 
  AlertTriangle,
  CloudRain
} from "lucide-react";
import Link from 'next/link';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ 
    domain: string;
    productId: string;
  }>;
}

interface Inventory {
  id: string;
  name: string;
  description: string | null;
  price: number;
  primaryImage: string | null;
  dimensions?: string;
  capacity?: number;
  type: string;
}

// Field configuration for different inventory types
type FieldName = 'dimensions' | 'capacity' | 'setupTime' | 'teardownTime' | 'minimumSpace' | 'weightLimit' | 'ageRange' | 'weatherRestrictions';

const typeFieldConfig: Record<string, { required: FieldName[]; optional: FieldName[] }> = {
  BOUNCE_HOUSE: {
    required: ['dimensions', 'capacity', 'setupTime', 'teardownTime', 'minimumSpace', 'weightLimit', 'ageRange'],
    optional: ['weatherRestrictions']
  },
  WATER_SLIDE: {
    required: ['dimensions', 'capacity', 'setupTime', 'teardownTime', 'minimumSpace', 'weightLimit', 'ageRange'],
    optional: ['weatherRestrictions']
  },
  GAME: {
    required: ['ageRange'],
    optional: ['dimensions', 'capacity', 'setupTime', 'teardownTime']
  },
  OTHER: {
    required: [],
    optional: ['dimensions', 'capacity', 'setupTime', 'teardownTime', 'minimumSpace', 'weightLimit', 'ageRange']
  }
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const { domain, productId } = params;
  const decodedDomain = decodeURIComponent(domain);

  try {
    // Get the business data
    const business = await getBusinessByDomain(decodedDomain);
    
    // Get the product data
    const product = await prisma.inventory.findUnique({
      where: {
        id: productId,
      },
    });
    
    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.',
      };
    }
    
    // Create product-specific metadata
    const title = `${product.name} | ${business.name}`;
    const description = product.description || `Rent ${product.name} from ${business.name} for your next event.`;
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: product.primaryImage ? [product.primaryImage] : (business.coverImage ? [business.coverImage] : []),
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: product.primaryImage ? [product.primaryImage] : (business.coverImage ? [business.coverImage] : []),
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product Details | Inflatable Rentals',
      description: 'View details about this inflatable rental product.',
    };
  }
}

// Helper function to format inventory type for display
const formatInventoryType = (type: string) => {
  return type.replace('_', ' ').split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

// Helper functions to check field visibility
const shouldShowField = (fieldName: FieldName, inventoryType: string) => {
  const config = typeFieldConfig[inventoryType] || typeFieldConfig.OTHER;
  return config.required.includes(fieldName) || config.optional.includes(fieldName);
};

const hasValue = (value: unknown) => {
  return value !== null && value !== undefined && value !== '' && value !== 0;
};

// Type-specific requirements and safety content
const getRequirementsContent = (type: string) => {
  const requirementsByType: Record<string, { title: string; items: string[] }> = {
    BOUNCE_HOUSE: {
      title: "Setup Requirements",
      items: [
        "Flat, level surface required for setup",
        "Access to electrical outlet within 100 feet",
        "Minimum clearance space around the inflatable",
        "Adult supervision required at all times",
        "No setup during rain or high winds",
        "Clear path for delivery (36\" minimum gate width)"
      ]
    },
    WATER_SLIDE: {
      title: "Setup Requirements", 
      items: [
        "Flat, level surface required for setup",
        "Access to electrical outlet within 100 feet", 
        "Access to water source for slide operation",
        "Minimum clearance space around the slide",
        "Adult supervision required at all times",
        "No setup during rain, high winds, or freezing temperatures",
        "Clear path for delivery (36\" minimum gate width)"
      ]
    },
    GAME: {
      title: "Setup Requirements",
      items: [
        "Flat surface for game setup",
        "Adult supervision recommended",
        "Adequate space for players to move safely",
        "Indoor or covered area recommended for weather protection"
      ]
    },
    OTHER: {
      title: "General Requirements", 
      items: [
        "Appropriate setup space as specified",
        "Adult supervision recommended", 
        "Follow any specific instructions provided",
        "Weather considerations as applicable"
      ]
    }
  };

  return requirementsByType[type] || requirementsByType.OTHER;
};

const getSafetyContent = (type: string) => {
  const safetyByType: Record<string, { guidelines: string[]; restrictions: string[] }> = {
    BOUNCE_HOUSE: {
      guidelines: [
        "Remove shoes, glasses, and jewelry before entering",
        "No food, drinks, or gum inside the inflatable", 
        "No flips, rough play, or climbing on walls",
        "Children of similar age and size should play together",
        "Exit immediately if the inflatable begins to deflate",
        "Maximum occupancy must not be exceeded"
      ],
      restrictions: [
        "Do not use during inclement weather",
        "No sharp objects or pets allowed",
        "No smoking or open flames near the unit"
      ]
    },
    WATER_SLIDE: {
      guidelines: [
        "Remove shoes, glasses, and jewelry before use",
        "No running or diving on the slide",
        "One person on slide at a time", 
        "Slide feet first only - no head first sliding",
        "Exit pool area immediately after sliding",
        "Adult supervision required at all times around water"
      ],
      restrictions: [
        "Do not use during lightning, rain, or high winds",
        "No glass containers or sharp objects near water areas",
        "Children must be able to swim or have flotation devices"
      ]
    },
    GAME: {
      guidelines: [
        "Read and follow all game instructions before play",
        "Adult supervision recommended for young children",
        "Play in designated area only",
        "Take turns and play fairly",
        "Handle game pieces with care"
      ],
      restrictions: [
        "Small parts may present choking hazard for children under 3",
        "Do not use damaged game pieces", 
        "Keep game dry and protected from weather"
      ]
    },
    OTHER: {
      guidelines: [
        "Follow all provided instructions carefully",
        "Adult supervision recommended",
        "Use item only as intended",
        "Inspect item before each use"
      ],
      restrictions: [
        "Do not exceed weight or capacity limits",
        "Report any damage immediately",
        "Use appropriate safety precautions"
      ]
    }
  };

  return safetyByType[type] || safetyByType.OTHER;
};

export default async function ProductDetailPage(props: PageProps) {
  const params = await props.params;
  const { domain, productId } = params;
  const decodedDomain = decodeURIComponent(domain);

  try {
    // Get the business data
    const business = await getBusinessByDomain(decodedDomain);
    
    // Get the site configuration
    const siteConfig = business.siteConfig || {};
    const colors = siteConfig.colors || {};
    
    // Set default colors if not provided
    const primaryColor = colors.primary || "#3b82f6";
    const secondaryColor = colors.secondary || "#6b7280";
    
    // Get the product data
    const product = await prisma.inventory.findUnique({
      where: {
        id: productId,
        businessId: business.id,
      },
    });
    
    if (!product) {
      return notFound();
    }
    
    // Get related products (same type)
    const relatedProducts = await prisma.inventory.findMany({
      where: {
        businessId: business.id,
        type: product.type,
        id: {
          not: product.id,
        },
        status: "AVAILABLE",
      },
      take: 3,
    });
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            href={`/inventory`}
            className="inline-flex items-center text-sm hover:text-blue-600 transition-colors"
            style={{ color: secondaryColor }}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Inventory
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="bg-white rounded-xl overflow-hidden border shadow-md">
            {product.primaryImage ? (
              <div className="relative aspect-square">
                <img 
                  src={product.primaryImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <Package className="h-24 w-24 text-gray-300" />
              </div>
            )}
            
            {/* Image gallery thumbnails if available */}
            {product.images && product.images.length > 1 && (
              <div className="flex overflow-x-auto p-2 gap-2 bg-gray-50">
                {product.images.map((image: string, index: number) => (
                  <div 
                    key={index} 
                    className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2"
                    style={{ borderColor: image === product.primaryImage ? primaryColor : 'transparent' }}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} view ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span 
                  className="px-3 py-1 text-xs font-medium rounded-full"
                  style={{ 
                    backgroundColor: `${primaryColor}15`, 
                    color: primaryColor 
                  }}
                >
                  {formatInventoryType(product.type)}
                </span>
                <span 
                  className="px-3 py-1 text-xs font-medium rounded-full"
                  style={{ 
                    backgroundColor: product.status === "AVAILABLE" ? "#dcfce7" : "#fee2e2",
                    color: product.status === "AVAILABLE" ? "#166534" : "#b91c1c"
                  }}
                >
                  {product.status}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p 
                className="text-2xl font-bold mt-2"
                style={{ color: primaryColor }}
              >
                ${product.price.toFixed(2)}<span className="text-sm font-normal text-gray-500">/day</span>
              </p>
            </div>
            
            <div className="prose max-w-none">
              <p className="text-gray-700">{product.description || 'No description available for this product.'}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {shouldShowField('dimensions', product.type) && hasValue(product.dimensions) && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Ruler className="h-5 w-5" style={{ color: primaryColor }} />
                  <span>Dimensions: {product.dimensions}</span>
                </div>
              )}
              {shouldShowField('capacity', product.type) && hasValue(product.capacity) && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-5 w-5" style={{ color: primaryColor }} />
                  <span>Capacity: {product.capacity} people</span>
                </div>
              )}
              {shouldShowField('weightLimit', product.type) && hasValue(product.weightLimit) && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Weight className="h-5 w-5" style={{ color: primaryColor }} />
                  <span>Weight Limit: {product.weightLimit} lbs</span>
                </div>
              )}
              {shouldShowField('setupTime', product.type) && hasValue(product.setupTime) && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-5 w-5" style={{ color: primaryColor }} />
                  <span>Setup: {product.setupTime} minutes</span>
                </div>
              )}
            </div>
            
            <div className="pt-6 border-t">
              <Button 
                size="lg" 
                className="w-full text-white" 
                style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
                asChild
              >
                <Link href={`/booking?item=${product.id}`}>
                  <Calendar className="h-5 w-5 mr-2" />
                  Book This Item
                </Link>
              </Button>
              <p className="text-xs text-center text-gray-500 mt-2">
                Secure your reservation now. Dates fill up quickly!
              </p>
            </div>
          </div>
        </div>
        
        {/* Product Tabs */}
        <Tabs defaultValue="details" className="mb-12">
          <TabsList 
            className="grid w-full grid-cols-3 p-1 rounded-t-lg"
            style={{ backgroundColor: `${primaryColor}15` }}
          >
            <TabsTrigger 
              value="details" 
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
              style={{ color: secondaryColor }}
            >
              <Zap className="h-4 w-4 mr-2" />
              Details & Specs
            </TabsTrigger>
            <TabsTrigger 
              value="requirements" 
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
              style={{ color: secondaryColor }}
            >
              <Info className="h-4 w-4 mr-2" />
              Requirements
            </TabsTrigger>
            <TabsTrigger 
              value="safety" 
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
              style={{ color: secondaryColor }}
            >
              <Shield className="h-4 w-4 mr-2" />
              Safety Info
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="p-6 border rounded-b-lg bg-white">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Product Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shouldShowField('dimensions', product.type) && hasValue(product.dimensions) && (
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Dimensions</span>
                    <span className="font-medium">{product.dimensions}</span>
                  </div>
                )}
                {shouldShowField('weightLimit', product.type) && hasValue(product.weightLimit) && (
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Weight Limit</span>
                    <span className="font-medium">{product.weightLimit} lbs</span>
                  </div>
                )}
                {shouldShowField('ageRange', product.type) && hasValue(product.ageRange) && (
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Age Range</span>
                    <span className="font-medium">{product.ageRange}</span>
                  </div>
                )}
                {shouldShowField('capacity', product.type) && hasValue(product.capacity) && (
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Max Capacity</span>
                    <span className="font-medium">{product.capacity} people</span>
                  </div>
                )}
                {shouldShowField('setupTime', product.type) && hasValue(product.setupTime) && (
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Setup Time</span>
                    <span className="font-medium">{product.setupTime} minutes</span>
                  </div>
                )}
                {shouldShowField('teardownTime', product.type) && hasValue(product.teardownTime) && (
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Teardown Time</span>
                    <span className="font-medium">{product.teardownTime} minutes</span>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="requirements" className="p-6 border rounded-b-lg bg-white">
            {(() => {
              const requirements = getRequirementsContent(product.type);
              return (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{requirements.title}</h3>
                  {shouldShowField('minimumSpace', product.type) && hasValue(product.minimumSpace) && (
                    <div className="flex items-start gap-2 mb-4">
                      <Ruler className="h-5 w-5 mt-0.5" style={{ color: primaryColor }} />
                      <div>
                        <p className="font-medium">Minimum Space Required</p>
                        <p className="text-gray-600">{product.minimumSpace}</p>
                      </div>
                    </div>
                  )}
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {requirements.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              );
            })()}
          </TabsContent>
          <TabsContent value="safety" className="p-6 border rounded-b-lg bg-white">
            {(() => {
              const safety = getSafetyContent(product.type);
              return (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Safety Guidelines</h3>
                  {shouldShowField('ageRange', product.type) && hasValue(product.ageRange) && (
                    <div className="flex items-start gap-2 mb-4">
                      <Users className="h-5 w-5 mt-0.5" style={{ color: primaryColor }} />
                      <div>
                        <p className="font-medium">Age Range</p>
                        <p className="text-gray-600">{product.ageRange}</p>
                      </div>
                    </div>
                  )}
                  
                  {shouldShowField('weatherRestrictions', product.type) && product.weatherRestrictions && product.weatherRestrictions.length > 0 && (
                    <div className="flex items-start gap-2 mb-4">
                      <CloudRain className="h-5 w-5 mt-0.5" style={{ color: primaryColor }} />
                      <div>
                        <p className="font-medium">Weather Restrictions</p>
                        <ul className="list-disc pl-5 text-gray-600">
                          {(product.weatherRestrictions as string[]).map((restriction: string, index: number) => (
                            <li key={index}>{restriction}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-700">Important Safety Guidelines</p>
                        <ul className="list-disc pl-5 space-y-2 text-yellow-700 mt-2">
                          {safety.guidelines.map((guideline, index) => (
                            <li key={index}>{guideline}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {safety.restrictions.length > 0 && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-700">Important Restrictions</p>
                          <ul className="list-disc pl-5 space-y-2 text-red-700 mt-2">
                            {safety.restrictions.map((restriction, index) => (
                              <li key={index}>{restriction}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </TabsContent>
        </Tabs>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center mb-6">
              <Star className="h-5 w-5 mr-2" style={{ color: primaryColor }} />
              <h2 className="text-2xl font-semibold">Related Products</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((item: Inventory) => (
                <Link 
                  key={item.id} 
                  href={`/${domain}/inventory/${item.id}`}
                  className="group border rounded-xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    {item.primaryImage ? (
                      <img 
                        src={item.primaryImage} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span 
                        className="text-white text-xs font-bold px-3 py-1 rounded-full"
                        style={{ backgroundColor: primaryColor }}
                      >
                        ${item.price.toFixed(2)}/day
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 
                      className="font-semibold text-lg transition-colors group-hover:text-blue-600"
                      style={{ color: secondaryColor }}
                    >
                      {item.name}
                    </h3>
                    <p className="text-gray-600 mt-1 line-clamp-2 text-sm">
                      {item.description || 'No description available.'}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        <span>Max {item.capacity}</span>
                      </div>
                      <div className="flex items-center">
                        <Ruler className="h-3 w-3 mr-1" />
                        <span>{item.dimensions}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error fetching product details:', error);
    return notFound();
  }
} 