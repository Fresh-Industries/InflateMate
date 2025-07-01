import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const sdkPath = path.join(process.cwd(), 'public', 'embed', 'inflatemate-embed.js');
    
    // Check if file exists
    if (!fs.existsSync(sdkPath)) {
      return new NextResponse('SDK not found', { status: 404 });
    }
    
    const sdkContent = fs.readFileSync(sdkPath, 'utf8');
    
    return new NextResponse(sdkContent, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=31536000, immutable', // 1 year cache
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Error serving SDK:', error);
    return new NextResponse('Error loading SDK', { status: 500 });
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