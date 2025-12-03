import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/firebase-admin';

const db = getAdminDb();
const redirectsDocRef = db.collection('qr_redirects').doc('config');

export async function GET() {
  try {
    const doc = await redirectsDocRef.get();
    if (!doc.exists) {
      // If the document doesn't exist, return default values
      return NextResponse.json({ qr1: '', qr2: '' });
    }
    return NextResponse.json(doc.data());
  } catch (error) {
    console.error("Error fetching QR redirects from Firestore:", error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Use set with merge: true to create or update the document
    await redirectsDocRef.set(body, { merge: true });
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error("Error saving QR redirects to Firestore:", error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
