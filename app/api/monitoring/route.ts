import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get search params from the URL
    const searchParams = request.nextUrl.searchParams;
    const orgId = searchParams.get('o');
    const projectId = searchParams.get('p');
    const region = searchParams.get('r');

    // Validate required params
    if (!orgId || !projectId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get the request body
    const body = await request.text();

    // Construct the Sentry URL
    const sentryUrl = `https://${orgId}.ingest.${region || 'us'}.sentry.io/api/${projectId}/envelope/`;

    // Forward the request to Sentry
    const response = await fetch(sentryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('content-type') || 'application/json',
        'User-Agent': request.headers.get('user-agent') || 'Sentry Next.js Proxy',
      },
      body: body,
    });

    if (!response.ok) {
      console.error('Failed to forward to Sentry:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to forward to Sentry' },
        { status: response.status }
      );
    }

    return new NextResponse(await response.text(), {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
      },
    });

  } catch (error) {
    console.error('Monitoring endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 