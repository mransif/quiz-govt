import { NextResponse } from 'next/server';
import { addParticipant } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body.name || !body.phone || body.score === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create participant object
    const participant = {
      name: body.name,
      phone: body.phone,
      score: body.score,
      timestamp: new Date().toISOString()
    };
    
    // Add participant to database
    const result = await addParticipant(participant);
    
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to add participant' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing participant data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}