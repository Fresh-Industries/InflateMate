import { NextRequest, NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
console.log(GOOGLE_API_KEY);

export async function GET(request: NextRequest) {
  try {
    // Get the search query from the URL
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    
    if (!query) {
      return NextResponse.json({ results: [] });
    }
    
    if (!GOOGLE_API_KEY) {
      console.error("Google Places API key is missing");
      throw new Error("API key not configured");
    }
    
    // Call the Google Places Autocomplete API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=(cities)&key=${GOOGLE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Google Places API responded with ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check for API errors
    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Google Places API error:", data.status, data.error_message);
      throw new Error(`Google Places API error: ${data.status}`);
    }
    
    // Transform the Google API response to a simpler format
    const results = data.predictions?.map((prediction: any) => ({
      placeId: prediction.place_id,
      description: prediction.description,
      mainText: prediction.structured_formatting?.main_text || prediction.description,
      secondaryText: prediction.structured_formatting?.secondary_text || ""
    })) || [];
    
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error searching for cities:", error);
    return NextResponse.json(
      { error: "Failed to search for cities" },
      { status: 500 }
    );
  }
} 