import { notFound } from 'next/navigation';
import { getBusinessByDomain } from '@/lib/business/domain-utils';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ domain: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const domain = decodeURIComponent(params.domain);

  try {
    const business = await getBusinessByDomain(domain);
    return {
      title: `Terms of Service - ${business.name}`,
      description: `Terms of Service for ${business.name} - Powered by InflateMate`,
    };
  } catch {
    return {
      title: 'Terms of Service',
      description: 'Terms of Service for Inflatable Rentals',
    };
  }
}

export default async function TermsPage(props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const domain = decodeURIComponent(params.domain);

  try {
    const business = await getBusinessByDomain(domain);
    const siteConfig = business.siteConfig || {};
    const colors = siteConfig.colors || {};
    const primaryColor = colors.primary || '#4f46e5';
    
    const lastUpdated = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return (
      <div className="min-h-screen bg-gray-50">
        <div 
          className="py-12 md:py-16"
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
            color: '#ffffff'
          }}
        >
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center">Terms of Service</h1>
            <p className="mt-4 text-center text-lg opacity-90">Last Updated: {lastUpdated}</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>1. Agreement to Terms</h2>
              <p className="text-gray-600">
                By accessing and using the services provided by {business.name} through the InflateMate platform, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>2. Rental Services</h2>
              <p className="text-gray-600 mb-4">
                {business.name} provides inflatable rental services for events and parties. Our services include:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Delivery and setup of inflatable equipment</li>
                <li>Pickup and breakdown of equipment</li>
                <li>Safety instructions and guidelines</li>
                <li>Cleaning and sanitization of equipment</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>3. Booking and Payment</h2>
              <p className="text-gray-600 mb-4">
                All bookings must be made through our official website or booking system. Payment terms:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>A deposit may be required to secure your booking</li>
                <li>Full payment is required before or upon delivery</li>
                <li>We accept major credit cards and other specified payment methods</li>
                <li>Cancellation policies apply as specified in your rental agreement</li>
                <li>Check your homeowner&apos;s or event insurance coverage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>4. Safety and Liability</h2>
              <p className="text-gray-600 mb-4">
                While {business.name} maintains high safety standards, customers agree to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Follow all provided safety instructions</li>
                <li>Supervise children at all times</li>
                <li>Not exceed recommended capacity limits</li>
                <li>Report any issues immediately</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>5. Weather and Cancellations</h2>
              <p className="text-gray-600">
                {business.name} reserves the right to cancel or postpone rentals due to inclement weather conditions that may compromise safety. We will work with you to reschedule or provide appropriate refunds according to our weather policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>6. Damage and Insurance</h2>
              <p className="text-gray-600">
                Customers are responsible for any damage to equipment beyond normal wear and tear. We recommend checking your homeowner&apos;s or event insurance coverage. Additional insurance options may be available through {business.name}.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>7. Contact Information</h2>
              <p className="text-gray-600">
                For questions about these terms or our services, please contact us at:
              </p>
              <div className="mt-4 space-y-2 text-gray-600">
                {business.phone && <p>Phone: {business.phone}</p>}
                {business.email && <p>Email: {business.email}</p>}
                {business.address && (
                  <p>Address: {business.address}, {business.city || ''} {business.state || ''} {business.zipCode || ''}</p>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>8. Communications and Notifications</h2>
              <p className="text-gray-600 mb-4">
                By using our services, you agree to receive communications from {business.name}, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Booking confirmations and reminders</li>
                <li>Delivery and pickup notifications</li>
                <li>Payment receipts and invoices</li>
                <li>Weather-related updates</li>
                <li>Service announcements and updates</li>
                <li>Marketing communications (with opt-out option)</li>
              </ul>
              <p className="text-gray-600 mt-4">
                These communications may be sent via email, SMS, or both. Standard message and data rates may apply for SMS notifications. By providing your mobile number, you consent to receive automated text messages. Reply STOP to opt out of SMS notifications.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>9. Changes to Terms</h2>
              <p className="text-gray-600">
                {business.name} reserves the right to modify these terms at any time. Changes will be effective immediately upon posting to our website. Continued use of our services constitutes acceptance of any modifications.
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                © {new Date().getFullYear()} {business.name} - Powered by InflateMate. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching business by domain:', error);
    return notFound();
  }
}
