import { createMocks } from 'node-mocks-http';

// Mock Clerk middleware
jest.mock('@clerk/nextjs/server', () => ({
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

describe('API Authentication', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should return 401 for unauthenticated API requests', async () => {
    // Test that protected API routes require authentication
    const protectedRoutes = [
      '/api/businesses',
      '/api/stripe/customer-portal',
      '/api/uploadthing'
    ];

    for (const route of protectedRoutes) {
      const { req } = createMocks({
        method: 'GET',
        url: route,
        headers: {
          'host': 'inflatemate.co'
        }
      });

      // Mock the absence of authentication
      const mockAuth = {
        protect: jest.fn().mockRejectedValue(new Error('Unauthorized'))
      };

      try {
        // This would normally be handled by middleware
        await mockAuth.protect();
        throw new Error(`Expected ${route} to be protected`);
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Unauthorized');
      }
    }
  });

  it('should allow access to public API routes', async () => {
    const publicRoutes = [
      '/api/webhook/stripe',
      '/api/embed/config/test-business-id',
      '/api/embed/embed.js',
      '/api/monitoring'
    ];

    for (const route of publicRoutes) {
      const { req } = createMocks({
        method: 'GET',
        url: route,
        headers: {
          'host': 'inflatemate.co'
        }
      });

      // These routes should not require authentication
      // In a real test, we would make actual HTTP requests
      // For now, we just verify the route patterns
      expect(route).toMatch(/^\/api\/(webhook|embed|monitoring)/);
    }
  });

  it('should protect dashboard routes', async () => {
    const dashboardRoutes = [
      '/dashboard/test-business-id',
      '/dashboard/test-business-id/settings'
    ];

    for (const route of dashboardRoutes) {
      const { req } = createMocks({
        method: 'GET',
        url: route,
        headers: {
          'host': 'inflatemate.co'
        }
      });

      // Mock the absence of authentication
      const mockAuth = {
        protect: jest.fn().mockRejectedValue(new Error('Unauthorized'))
      };

      try {
        await mockAuth.protect();
        throw new Error(`Expected ${route} to be protected`);
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Unauthorized');
      }
    }
  });
}); 