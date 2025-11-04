import { NextResponse } from 'next/server';

// Ravelry API documentation: https://www.ravelry.com/api
// You'll need to create an app at: https://www.ravelry.com/pro/developer

const RAVELRY_USERNAME = process.env.RAVELRY_API_USERNAME;
const RAVELRY_PASSWORD = process.env.RAVELRY_API_PASSWORD;

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'Pattern URL is required' },
        { status: 400 }
      );
    }

    // Check if API credentials are configured
    if (!RAVELRY_USERNAME || !RAVELRY_PASSWORD) {
      return NextResponse.json(
        { 
          error: 'Ravelry API credentials not configured. Please add RAVELRY_API_USERNAME and RAVELRY_API_PASSWORD to your .env.local file.',
          needsConfig: true 
        },
        { status: 503 }
      );
    }

    // Extract pattern slug from URL
    // Ravelry pattern URLs look like: https://www.ravelry.com/patterns/library/pattern-slug
    const patternMatch = url.match(/\/patterns\/library\/([^\/\?]+)/);
    
    if (!patternMatch) {
      return NextResponse.json(
        { error: 'Invalid Ravelry pattern URL' },
        { status: 400 }
      );
    }

    const patternSlug = patternMatch[1];

    // Create Basic Auth header
    const auth = Buffer.from(`${RAVELRY_USERNAME}:${RAVELRY_PASSWORD}`).toString('base64');

    console.log('Calling Ravelry API for pattern slug:', patternSlug);
    console.log('Using username:', RAVELRY_USERNAME);

    // First, search for the pattern to get its ID
    // Ravelry API docs: https://www.ravelry.com/api#pattern_search_result
    const searchResponse = await fetch(
      `https://api.ravelry.com/patterns/search.json?query=${encodeURIComponent(patternSlug)}&page_size=1`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json',
        },
      }
    );

    console.log('Ravelry search response status:', searchResponse.status);

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.log('Ravelry search error:', errorText);
      
      if (searchResponse.status === 401) {
        return NextResponse.json(
          { error: 'Invalid Ravelry API credentials' },
          { status: 401 }
        );
      }
      throw new Error(`Ravelry search returned ${searchResponse.status}: ${errorText}`);
    }

    const searchData = await searchResponse.json();
    
    if (!searchData.patterns || searchData.patterns.length === 0) {
      return NextResponse.json(
        { error: 'Pattern not found on Ravelry' },
        { status: 404 }
      );
    }

    const patternId = searchData.patterns[0].id;
    console.log('Found pattern ID:', patternId);

    // Now fetch the full pattern details
    const ravelryResponse = await fetch(
      `https://api.ravelry.com/patterns/${patternId}.json`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json',
        },
      }
    );

    console.log('Ravelry API response status:', ravelryResponse.status);

    if (!ravelryResponse.ok) {
      const errorText = await ravelryResponse.text();
      console.log('Ravelry API error response:', errorText);
      
      if (ravelryResponse.status === 401) {
        return NextResponse.json(
          { error: 'Invalid Ravelry API credentials' },
          { status: 401 }
        );
      }
      throw new Error(`Ravelry API returned ${ravelryResponse.status}: ${errorText}`);
    }

    const data = await ravelryResponse.json();

    // The response contains a 'pattern' object
    if (!data.pattern) {
      return NextResponse.json(
        { error: 'Pattern not found on Ravelry' },
        { status: 404 }
      );
    }

    const pattern = data.pattern;

    // Transform Ravelry data to our format
    const transformedPattern = {
      name: pattern.name,
      designer: pattern.designer?.name || pattern.pattern_author?.name || '',
      source_url: url,
      scraped_data: {
        ravelry_id: pattern.id,
        permalink: pattern.permalink,
        craft: pattern.craft?.name,
        categories: pattern.pattern_categories?.map((cat: any) => cat.name) || [],
        difficulty: pattern.difficulty_average,
        yardage: pattern.yardage,
        yardage_max: pattern.yardage_max,
        gauge: pattern.gauge,
        gauge_divisor: pattern.gauge_divisor,
        gauge_pattern: pattern.gauge_pattern,
        sizes_available: pattern.sizes_available,
        notes: pattern.notes_html,
        pattern_type: pattern.pattern_type?.name,
        free: pattern.free,
        price: pattern.price,
        currency: pattern.currency,
        downloadable: pattern.downloadable,
        photos: pattern.photos?.map((photo: any) => ({
          small_url: photo.small_url,
          medium_url: photo.medium_url,
          thumbnail_url: photo.thumbnail_url,
        })) || [],
      },
    };

    return NextResponse.json(transformedPattern);
  } catch (error) {
    console.error('Error fetching from Ravelry API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pattern from Ravelry' },
      { status: 500 }
    );
  }
}

