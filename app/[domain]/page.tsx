// DomainPage.tsx
import { notFound } from 'next/navigation';
import { DynamicSection, getBusinessByDomain } from '@/lib/business/domain-utils';
import { Metadata } from 'next';
import SectionRenderer from './_components/SectionRenderer';
import { themeConfig } from '@/app/[domain]/_themes/themeConfig';
import { ThemeColors } from '@/app/[domain]/_themes/types';
import Hero from './_components/LandingPage/Hero';
import FeatureGrid from './_components/LandingPage/FeatureGrid';
import PopularRentalsGrid from './_components/LandingPage/PopularRentalsGrid';
import { prisma } from '@/lib/prisma';
import CTA from './_components/LandingPage/CTA';
import Contact from './_components/LandingPage/Contact';
import { makeScale } from './_themes/utils';
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

export default async function DomainPage({ params }: { params: Promise<{ domain: string }> }) {
  const domain = decodeURIComponent((await params).domain);
  
  try {
    const business = await getBusinessByDomain(domain);
    const siteConfig = business.siteConfig || {};
    
    // Determine Theme
    const rawThemeName = (siteConfig.themeName?.name as string) || 'modern';
    const themeName = Object.keys(themeConfig).includes(rawThemeName) ? rawThemeName : 'modern';
    
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

    const inventoryItems = await prisma.inventory.findMany({
      where: { businessId: business.id, status: 'AVAILABLE' },
      select: { id: true, name: true, description: true, price: true, primaryImage: true, type: true },
      take: 3,           // or however many "popular" you want
    });


    // --- Render Page --- 
    return (
      // Base background color from theme or default white
      <div className="min-h-screen" style={{ background: colors.background[100] }}>
        <Hero
            colors={colors}
            themeName={themeName}
            title={siteConfig.hero?.title || `Bounce Into Fun With ${business.name}!`}
            subtitle={siteConfig.hero?.description || 'Premium inflatable rentals for birthdays, events, and parties. Making memories that last a lifetime!'}
            imageUrl={siteConfig.hero?.imageUrl || '/images/hero-image.jpg'}
        />

        <FeatureGrid
            themeName={themeName}
            colors={colors}
            items={[
              { icon: '🧼', title: 'Clean & Safe', description: 'Thorough sanitising after every rental.' },
              { icon: '🎉', title: 'All-Ages Fun', description: 'Sizes and styles for kids and adults.' },
              { icon: '🚚', title: 'Free Delivery', description: 'We handle setup and pickup for you.' },
            ]}
          />
        
      
        {/* DYNAMIC LANDING SECTIONS - Rendered via SectionRenderer */}
        {siteConfig.landing?.sections?.map((section: DynamicSection) => (
          <section key={section.id} className="dynamic-section" style={{ background: section.backgroundColor }}>
            {/* Removed theme and colors props */}
            <SectionRenderer section={section} themeName={themeName} colors={colors} /> 
          </section>
        ))}

        <PopularRentalsGrid
          items={inventoryItems}
          colors={colors}
          themeName={themeName}
        />

        <CTA
          themeName={themeName}
          colors={colors}
          title="Ready to Make Your Event Unforgettable?"
          subtitle="Book your bounce house today and create memories that will last a lifetime!"
          ctaHref="/booking"
          ctaLabel="Book Your Bounce House"
        />
         
         <Contact 
  themeName={themeName}
  colors={colors}
  business={{
    name: business.name,
    phone: business.phone,
    email: business.email,
    address: business.address,
    city: business.city,
    state: business.state,
    zipCode: business.zipCode,
    serviceArea: business.serviceArea as string[]
  }}
/>

      </div>
    );
  } catch (error) {
    console.error('Error fetching business by domain:', error);
    return notFound(); // Render 404 page on error
  }
}
