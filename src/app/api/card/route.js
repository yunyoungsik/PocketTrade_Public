import { NextResponse } from 'next/server';
import Card from '@/db/models/card.model';
import { connectDB } from '@/lib/connectDB';

export const GET = async () => {
  try {
    await connectDB();
    const cards = await Card.find();
    return NextResponse.json({ cards: cards }, { status: 200 });
  } catch (error) {
    console.error('Error Auth Cards', error);
    return NextResponse.json({ message: 'Server error', error }, { status: 500 });
  }
};
