# InflateMate - Multi-tenant Platform with Custom Domain Support

InflateMate is a multi-tenant platform that allows businesses to create their own websites with custom domain support. This project is built with Next.js, Clerk for authentication, and Prisma for database access.

## Features

- **Multi-tenancy**: Each business gets their own website
- **Custom Domain Support**: Businesses can connect their own domains to their websites
- **Subdomain Support**: Each business gets a subdomain based on their name (e.g., `business-name.localhost:3000`)
- **Dashboard**: Businesses can manage their website content and settings
- **Authentication**: Secure authentication with Clerk

## Custom Domain Implementation

The platform supports custom domains through the following components:

### 1. Middleware

The middleware (`middleware.ts`) handles routing for custom domains and subdomains:

- Detects if the request is coming from a custom domain or subdomain
- Rewrites the request to the appropriate route
- Handles authentication for protected routes

### 2. Domain Settings

Businesses can configure their custom domains in the dashboard:

- Set up a custom domain
- Verify domain ownership
- Configure DNS settings
- Preview their website

### 3. Dynamic Routes

The application uses dynamic routes to serve content based on the domain:

- `/[domain]/*` - Routes for both custom domains and business subdomains

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables (copy `.env.example` to `.env.local`)
4. Run database migrations:
   ```
   npx prisma migrate dev
   ```
5. Start the development server:
   ```
   npm run dev
   ```

## Local Development with Custom Domains

To test custom domains locally:

1. Add entries to your hosts file:
   ```
   127.0.0.1 business-name.localhost
   127.0.0.1 custom-domain.localhost
   ```
2. Access your business site at `http://business-name.localhost:3000`
3. Configure a custom domain in the dashboard
4. Access your site via the custom domain at `http://custom-domain.localhost:3000`

## Production Deployment

For production deployment with real custom domains:

1. Set up a wildcard DNS record for your main domain (e.g., `*.yourdomain.com`)
2. Configure your DNS provider to allow custom domain CNAME records
3. Implement proper domain verification (TXT records)
4. Set up SSL certificate provisioning for custom domains

## Architecture

The custom domain feature is implemented with the following architecture:

1. **Middleware**: Handles domain detection and routing
2. **Database**: Stores custom domain mappings for each business
3. **API Routes**: Provides endpoints for domain verification and management
4. **UI Components**: Allows businesses to manage their domains

## License

This project is licensed under the MIT License - see the LICENSE file for details.
