import { notFound } from 'next/navigation';
import { getBusinessByDomain } from '@/lib/business/domain-utils';
import { NewBookingForm } from "./_components/customer-booking-form";
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

export default async function BookingPage({ params }: { params: { domain: string } }) {
  const domain = decodeURIComponent(await params.domain);
  console.log('Booking page rendered with domain:', domain);
  
  try {
    // Use the domain utils to find the business by either custom domain or subdomain
    const business = await getBusinessByDomain(domain);
    console.log('Business:', business);
    
    return (
      <div className="container mx-auto px-4 py-8">
        
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-semibold mb-6">Make a Reservation</h2>
            
            <NewBookingForm businessId={business.id}/>
          </div>
          
          
        </div>
    );
  } catch (error) {
    console.error('Error fetching business by domain:', error);
    return notFound();
  }
} 