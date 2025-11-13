import { NextResponse } from 'next/server';
import { detectAllergensFlow } from '@/ai/allergenDetection';

export async function POST(request: Request) {
  try {
    const { dishName } = await request.json();

    if (!dishName) {
      return NextResponse.json({ error: 'dishName is required' }, { status: 400 });
    }

    console.log(`[API] Received request to analyze dish: "${dishName}"`);

    const result = await detectAllergensFlow(dishName);
    
    console.log(`[API] Analysis complete. Allergens found:`, result.allergens);

    return NextResponse.json(result);

  } catch (error) {
    console.error('[API] Error in detect-allergens route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
