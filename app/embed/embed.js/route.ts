import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const embedPath = path.join(process.cwd(), 'public', 'embed', 'inflatemate-embed.js');
    
    // Check if file exists
    if (!fs.existsSync(embedPath)) {
      return new NextResponse('Embed script not found', { status: 404 });
    }
    
    const embedContent = fs.readFileSync(embedPath, 'utf8');
    
    return new NextResponse(embedContent, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'no-cache, no-store, must-revalidate', // Disable all caching for development
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'X-Content-Type-Options': 'nosniff',
        'ETag': `"embed-${Date.now()}"`, // Add ETag for cache busting
      },
    });
  } catch (error) {
    console.error('Error serving embed script:', error);
    return new NextResponse('Error loading embed script', { status: 500 });
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 