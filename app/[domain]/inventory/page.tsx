import { notFound } from 'next/navigation';
import { getBusinessByDomain } from '@/lib/business/domain-utils';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Tag, ChevronRight } from "lucide-react";
import Link from 'next/link';
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
    
    // Create inventory-specific metadata
    const title = `Inventory | ${business.name}`;
    const description = `Browse our selection of premium inflatable rentals for your next event. ${business.name} offers a variety of bounce houses, water slides, and games.`;
    
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
      title: 'Inventory | Inflatable Rentals',
      description: 'Browse our selection of premium inflatable rentals for your next event.',
    };
  }
}

export default async function InventoryPage({ params }: { params: { domain: string } }) {
  const domain = decodeURIComponent(params.domain);
  console.log('Inventory page rendered with domain:', domain);
  
  try {
    // Use the domain utils to find the business by either custom domain or subdomain
    const business = await getBusinessByDomain(domain);
    
    // Get the site configuration
    const siteConfig = business.siteConfig || {};
    
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
        status: true,
        primaryImage: true,
        type: true,
      },
    });
    
    // Group inventory items by type
    const itemsByType: Record<string, typeof inventoryItems> = {};
    inventoryItems.forEach(item => {
      const type = item.type || 'Inflatable Rentals'; // Use the type field if it exists
      if (!itemsByType[type]) {
        itemsByType[type] = [];
      }
      itemsByType[type].push(item);
    });
    
    // Calculate stats
    const totalItems = inventoryItems.length;
    const types = Object.keys(itemsByType).length;
    const lowestPrice = inventoryItems.length > 0 
      ? Math.min(...inventoryItems.map(item => item.price))
      : 0;
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
            <p className="text-muted-foreground mt-1">
              Browse our selection of inflatable rentals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                <CardDescription>Available for rent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <span className="text-2xl font-bold">{totalItems}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    <span>View All</span>
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Types</CardTitle>
                <CardDescription>Product types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-muted-foreground" />
                    <span className="text-2xl font-bold">{types}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    <span>Browse</span>
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Starting Price</CardTitle>
                <CardDescription>Per day rental</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">${lowestPrice.toFixed(2)}</span>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs" asChild>
                    <Link href="/booking">
                      <span>Book Now</span>
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Display inventory items by type */}
          {Object.entries(itemsByType).map(([type, items]) => (
            <div key={type} className="bg-white p-6 rounded-lg shadow-sm border mt-8">
              <h2 className="text-2xl font-semibold mb-6">{type}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <div key={item.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-200 h-48 flex items-center justify-center">
                      {item.primaryImage ? (
                        <img 
                          src={item.primaryImage} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500">Product Image</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-600 mt-2 line-clamp-3">
                        {item.description || 'No description available.'}
                      </p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="font-bold">${item.price.toFixed(2)}/day</span>
                        <Button asChild>
                          <Link href="/booking">
                            Book Now
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {inventoryItems.length === 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border mt-8 text-center">
              <h2 className="text-xl font-semibold mb-2">No inventory items available</h2>
              <p className="text-muted-foreground">
                Please check back later for available inflatable rentals.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching business by domain:', error);
    return notFound();
  }
} 