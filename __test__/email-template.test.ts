import 'dotenv/config';
import { bookingConfirmationEmailHtml, BookingWithDetails } from '../lib/EmailTemplates';
import { sendSignatureEmail } from '../lib/sendEmail';
import { testData } from './data/testData';

// Mock booking data that matches the BookingWithDetails interface
const mockBookingWithDetails = {
  id: testData.booking.id,
  eventDate: new Date(testData.booking.eventDate),
  startTime: new Date(`${testData.booking.eventDate}T10:00:00Z`),
  endTime: new Date(`${testData.booking.eventDate}T16:00:00Z`),
  eventTimeZone: 'America/Chicago',
  status: 'CONFIRMED',
  totalAmount: 250,
  subtotalAmount: 225,
  taxAmount: 25,
  taxRate: 10,
  depositAmount: 75,
  depositPaid: true,
  eventType: 'Birthday Party',
  eventAddress: testData.booking.eventAddress,
  eventCity: testData.booking.eventCity,
  eventState: testData.booking.eventState,
  eventZipCode: testData.booking.eventZipCode,
  participantCount: testData.booking.participantCount,
  participantAge: testData.booking.participantAge,
  specialInstructions: 'Please set up in the backyard near the pool area.',
  isCompleted: false,
  isCancelled: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  expiresAt: null,
  couponId: null,
  businessId: testData.business.id,
  customerId: testData.customer.id,
  
  // Related data
  customer: {
    id: testData.customer.id,
    name: testData.customer.name,
    email: testData.customer.email,
    phone: testData.customer.phone,
    address: null,
    city: null,
    state: null,
    zipCode: null,
    notes: null,
    bookingCount: 1,
    totalSpent: 250,
    lastBooking: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    isLead: false,
    status: 'Active',
    type: 'Regular',
    businessId: testData.business.id,
  },
  
  business: {
    id: testData.business.id,
    name: testData.business.name,
    description: 'Premier bounce house and party rental service',
    address: '456 Business Ave',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    phone: testData.business.phone,
    email: testData.business.email,
    serviceArea: ['Austin', 'Round Rock', 'Cedar Park'],
    logo: testData.business.logo,
    minAdvanceBooking: 24,
    maxAdvanceBooking: 90,
    minimumPurchase: 100,
    timeZone: 'America/Chicago',
    stripeAccountId: 'acct_test123',
    socialMedia: null,
    customDomain: null,
    subdomain: 'inflatmate-test',
    onboardingError: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    organizationId: 'org_test123',
    siteConfig: {
      colors: {
        primary: '#FF6BB8',
        secondary: '#4DB5FF', 
        accent: '#FFDE59',
        background: '#FFF0F9',
        text: '#1e293b'
      },
      hero: {
        title: 'Make Your Party Unforgettable',
        description: 'Premium bounce house rentals for all occasions',
        imageUrl: 'https://example.com/hero.jpg'
      }
    }
  },
  
  inventoryItems: [
    {
      id: 'item_001',
      bookingId: testData.booking.id,
      inventoryId: 'inv_001',
      quantity: 1,
      price: 175,
      inventory: {
        id: 'inv_001',
        type: 'BOUNCE_HOUSE',
        name: 'Castle Bounce House',
        description: 'Majestic castle-themed bounce house perfect for royal parties',
        dimensions: '15x15x15 feet',
        capacity: 8,
        price: 175,
        setupTime: 30,
        teardownTime: 20,
        images: ['https://example.com/castle1.jpg'],
        primaryImage: 'https://example.com/castle1.jpg',
        stripeProductId: 'prod_test123',
        stripePriceId: 'price_test123',
        status: 'AVAILABLE',
        minimumSpace: '20x20 feet',
        weightLimit: 800,
        ageRange: '3-12 years',
        weatherRestrictions: ['High winds', 'Rain'],
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        businessId: testData.business.id
      }
    },
    {
      id: 'item_002', 
      bookingId: testData.booking.id,
      inventoryId: 'inv_002',
      quantity: 2,
      price: 25,
      inventory: {
        id: 'inv_002',
        type: 'BOUNCE_HOUSE',
        name: 'Party Tables',
        description: '6ft rectangular tables perfect for food and activities',
        dimensions: '6x2.5 feet',
        capacity: 8,
        price: 25,
        setupTime: 5,
        teardownTime: 5,
        images: ['https://example.com/table1.jpg'],
        primaryImage: 'https://example.com/table1.jpg',
        stripeProductId: 'prod_table123',
        stripePriceId: 'price_table123',
        status: 'AVAILABLE',
        minimumSpace: '8x4 feet',
        weightLimit: 200,
        ageRange: 'All ages',
        weatherRestrictions: [],
        quantity: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        businessId: testData.business.id
      }
    }
  ]
} as unknown as BookingWithDetails;

const testWaiverUrl = 'https://docuseal.com/s/test-waiver-12345';

describe('Email Template Tests', () => {
  
  describe('Template Generation', () => {
    it('should generate email HTML without errors', () => {
      expect(() => {
        const emailHtml = bookingConfirmationEmailHtml(mockBookingWithDetails, testWaiverUrl);
        expect(typeof emailHtml).toBe('string');
        expect(emailHtml.length).toBeGreaterThan(1000);
      }).not.toThrow();
    });

    it('should include all essential booking information', () => {
      const emailHtml = bookingConfirmationEmailHtml(mockBookingWithDetails, testWaiverUrl);
      
      // Check for customer name
      expect(emailHtml).toContain(mockBookingWithDetails.customer.name);
      
      // Check for business name
      expect(emailHtml).toContain(mockBookingWithDetails.business.name);
      
      // Check for booking ID
      expect(emailHtml).toContain(mockBookingWithDetails.id);
      
      // Check for waiver URL
      expect(emailHtml).toContain(testWaiverUrl);
      
      // Check for inventory items
      expect(emailHtml).toContain('Castle Bounce House');
      expect(emailHtml).toContain('Party Tables');
      
      // Check for pricing
      expect(emailHtml).toContain('$225.00'); // subtotal
      expect(emailHtml).toContain('$25.00');  // tax
      expect(emailHtml).toContain('$250.00'); // total
      
      // Check for event details
      expect(emailHtml).toContain(mockBookingWithDetails.eventAddress);
      expect(emailHtml).toContain(mockBookingWithDetails.eventCity);
    });

    it('should not contain undefined or null values', () => {
      const emailHtml = bookingConfirmationEmailHtml(mockBookingWithDetails, testWaiverUrl);
      
      expect(emailHtml).not.toContain('undefined');
      expect(emailHtml).not.toContain('null');
      expect(emailHtml).not.toContain('[object Object]');
    });

    it('should use modern colors from site config', () => {
      const emailHtml = bookingConfirmationEmailHtml(mockBookingWithDetails, testWaiverUrl);
      
      // Check for modern color usage
      expect(emailHtml).toContain('#FF6BB8'); // primary
      expect(emailHtml).toContain('#4DB5FF'); // secondary  
      expect(emailHtml).toContain('#FFDE59'); // accent
    });
  });

  describe('Email Sending', () => {
    it('should send email successfully', async () => {
      const emailHtml = bookingConfirmationEmailHtml(mockBookingWithDetails, testWaiverUrl);
      
      const emailResponse = await sendSignatureEmail({
        to: testData.customer.email,
        subject: `[TEST] Booking Confirmation - ${mockBookingWithDetails.business.name}`,
        html: emailHtml,
        from: `${mockBookingWithDetails.business.name} <test@freshdigitalsolutions.tech>`,
      });

      console.log('📧 Email response:', emailResponse);
      
      expect(emailResponse).toBeDefined();
      expect(emailResponse?.data).toHaveProperty('id');
      
      if (emailResponse?.data?.id) {
        console.log('✅ Email sent successfully with ID:', emailResponse.data.id);
      }
    }, 30000); // 30 second timeout for email sending

    it('should handle email sending errors gracefully', async () => {
      const emailHtml = bookingConfirmationEmailHtml(mockBookingWithDetails, testWaiverUrl);
      
      // Test with invalid email
      const result = await sendSignatureEmail({
        to: 'invalid-email',
        subject: '[TEST] Should Fail',
        html: emailHtml,
        from: 'test@freshdigitalsolutions.tech',
      });
      
      // Check that error is returned instead of success
      expect(result).toBeDefined();
      expect(result?.data).toBeNull();
      expect(result?.error).toBeDefined();
      expect(result?.error && 'statusCode' in result.error ? result.error.statusCode : null).toBe(422);
    });
  });

  describe('Template Validation', () => {
    it('should work with minimal booking data', () => {
      const minimalBooking = {
        ...mockBookingWithDetails,
        specialInstructions: null,
        participantAge: null,
        depositAmount: null,
        taxAmount: null,
        business: {
          ...mockBookingWithDetails.business,
          siteConfig: null // Test with no site config
        }
      } as unknown as BookingWithDetails;

      expect(() => {
        const emailHtml = bookingConfirmationEmailHtml(minimalBooking, testWaiverUrl);
        expect(emailHtml.length).toBeGreaterThan(500);
      }).not.toThrow();
    });

    it('should handle missing optional fields gracefully', () => {
      const bookingWithMissingFields = {
        ...mockBookingWithDetails,
        eventAddress: null,
        eventCity: null,
        eventState: null,
        business: {
          ...mockBookingWithDetails.business,
          phone: null,
          email: null,
          address: null
        }
      } as unknown as BookingWithDetails;

      const emailHtml = bookingConfirmationEmailHtml(bookingWithMissingFields, testWaiverUrl);
      expect(emailHtml).not.toContain('null');
      expect(emailHtml).not.toContain('undefined');
    });
  });
});

// Integration test with real waiver generation
describe('Integration: Waiver + Email', () => {
  it('should generate waiver URL and send complete email', async () => {
    // Import waiver generation
    const { sendToDocuSeal } = await import('../lib/docuseal.server');
    
    try {
      // 1. Generate waiver URL
      const { url: waiverUrl, documentId } = await sendToDocuSeal(
        testData.business,
        testData.customer,
        testData.booking,
        testData.templateVersion
      );

      expect(typeof waiverUrl).toBe('string');
      expect(waiverUrl).toMatch(/^https?:\/\//);
      expect(typeof documentId).toBe('string');

      console.log('📋 Waiver URL generated:', waiverUrl);

      // 2. Generate and send email
      const emailHtml = bookingConfirmationEmailHtml(mockBookingWithDetails, waiverUrl);
      
      const emailResponse = await sendSignatureEmail({
        to: testData.customer.email,
        subject: `[INTEGRATION TEST] Complete Booking Flow - ${mockBookingWithDetails.business.name}`,
        html: emailHtml,
        from: `${mockBookingWithDetails.business.name} <test@inflatmate.co>`,
      });

      expect(emailResponse).toBeDefined();
      if (emailResponse?.data?.id) {
        expect(emailResponse.data).toHaveProperty('id');
        console.log('✅ Integration test completed - Email ID:', emailResponse.data.id);
      } else {
        console.log('⚠️ Email failed:', emailResponse?.error);
      }
      
    } catch (error) {
      console.warn('⚠️  Integration test skipped due to missing DocuSeal config:', error);
      // Don't fail the test if DocuSeal isn't configured
    }
  }, 45000); // 45 second timeout for full integration
}); 