import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const redirectsFilePath = path.join(process.cwd(), 'src/lib/qr-redirects.json');

export async function GET() {
  try {
    const data = await fs.readFile(redirectsFilePath, 'utf-8');
    const redirects = JSON.parse(data);
    return NextResponse.json(redirects);
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await fs.writeFile(redirectsFilePath, JSON.stringify(body, null, 2));
    return new Response('OK', { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
