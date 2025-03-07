import { notFound } from 'next/navigation';
import { getBusinessByDomain } from '@/lib/business/domain-utils';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarPlus, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomerBookingForm } from './customer-booking-form';
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
    
    // Create booking-specific metadata
    const title = `Book Now | ${business.name}`;
    const description = `Reserve your bounce house or inflatable rental with ${business.name}. Easy online booking for your next party or event.`;
    
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
      title: 'Book Now | Inflatable Rentals',
      description: 'Reserve your bounce house or inflatable rental for your next party or event.',
    };
  }
}

// Define types matching what the API expects
interface BounceHouse {
  id: string;
  name: string;
  price: number;
  status: string;
  description?: string;
  primaryImage?: string;
}

export default async function BookingPage({ params }: { params: { domain: string } }) {
  const domain = decodeURIComponent(params.domain);
  console.log('Booking page rendered with domain:', domain);
  
  try {
    // Use the domain utils to find the business by either custom domain or subdomain
    const business = await getBusinessByDomain(domain);
    
    // Get the site configuration
    const siteConfig = business.siteConfig || {};
    
    // Fetch available bounce houses for this business
    const bounceHouses = await prisma.inventory.findMany({
      where: {
        businessId: business.id,
        status: "AVAILABLE",
      },
      select: {
        id: true,
        name: true,
        price: true,
        status: true,
        description: true,
        primaryImage: true,
      },
    });
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Book Now</h1>
            <p className="text-muted-foreground mt-1">
              Reserve your bounce house for your next event
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Available Items</CardTitle>
                <CardDescription>Ready to book</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="text-2xl font-bold">{bounceHouses.length}</span>
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
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                <CardDescription>Next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarPlus className="h-5 w-5 text-muted-foreground" />
                    <span className="text-2xl font-bold">Book Now</span>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    <span>Calendar</span>
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
                  <span className="text-2xl font-bold">
                    ${Math.min(...bounceHouses.map(bh => bh.price), 99.99).toFixed(2)}
                  </span>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    <span>Details</span>
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-semibold mb-6">Make a Reservation</h2>
            
            <CustomerBookingForm 
              businessId={business.id} 
              bounceHouses={bounceHouses as BounceHouse[]} 
            />
          </div>
          
          {bounceHouses.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border mt-8">
              <h2 className="text-2xl font-semibold mb-6">Available Inflatables</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bounceHouses.map((item) => (
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
                      <p className="text-gray-600 mt-2">
                        {item.description || 'No description available.'}
                      </p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="font-bold">${item.price.toFixed(2)}/day</span>
                        <Button>
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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