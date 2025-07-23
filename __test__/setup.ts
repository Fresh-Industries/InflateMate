import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfills for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock environment variables for tests
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.CLERK_SECRET_KEY = 'test_secret_key';
process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
process.env.NEXTAUTH_SECRET = 'test_secret';

// Mock Clerk authentication - match your existing project structure
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(() => ({ userId: 'test_user_id', orgId: 'test_org_id' })),
  currentUser: jest.fn(() => ({ 
    id: 'test_user_id', 
    emailAddresses: [{ emailAddress: 'test@example.com' }] 
  })),
  clerkMiddleware: (handler: any) => handler,
  createRouteMatcher: (routes: string[]) => (req: any) => {
    const pathname = req.url || req.nextUrl?.pathname || '';
    return routes.some(route => {
      if (route.includes('(.*)')) {
        const baseRoute = route.replace('(.*)', '');
        return pathname.startsWith(baseRoute);
      }
      return pathname === route || pathname.startsWith(route);
    });
  }
}));

// Mock your auth utilities
jest.mock('../lib/auth/clerk-utils', () => ({
  getCurrentUserWithOrgAndBusiness: jest.fn(),
  getPrimaryMembership: jest.fn(),
  getMembershipByBusinessId: jest.fn(),
}));

// Mock Prisma client
jest.mock('../lib/prisma', () => ({
  prisma: {
    business: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    booking: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    customer: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    subscription: {
      findUnique: jest.fn(),
    },
    organization: {
      findUnique: jest.fn(),
    },
    $disconnect: jest.fn(),
  },
}));

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    customers: {
      create: jest.fn(),
      retrieve: jest.fn(),
    },
    accounts: {
      create: jest.fn(),
    },
  }));
});

// Mock Next.js server functions
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((data, options) => ({
      json: async () => data,
      status: options?.status || 200,
    })),
  },
}));

// Suppress console errors during tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
}; 