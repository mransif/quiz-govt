import { NextResponse } from 'next/server';
import { getLeaderboard } from '@/lib/db';

export async function GET() {
  try {
    // Get sorted leaderboard data
    const leaderboard = await getLeaderboard();
    
    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}