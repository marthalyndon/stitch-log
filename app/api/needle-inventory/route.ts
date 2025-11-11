import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('needle_inventory')
      .select('*')
      .order('type', { ascending: true })
      .order('size', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching needle inventory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch needle inventory' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { size, type, length } = await request.json();

    if (!size || !type) {
      return NextResponse.json(
        { error: 'Size and type are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('needle_inventory')
      .insert({ size, type, length })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating needle:', error);
    return NextResponse.json(
      { error: 'Failed to create needle' },
      { status: 500 }
    );
  }
}

