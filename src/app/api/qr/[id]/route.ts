import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const redirectsFilePath = path.join(process.cwd(), 'src/lib/qr-redirects.json');

type Redirects = {
    qr1: string;
    qr2: string;
};

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const qrId = params.id;

    if (qrId !== '1' && qrId !== '2') {
        return new Response('Not Found', { status: 404 });
    }

    try {
        const data = await fs.readFile(redirectsFilePath, 'utf-8');
        const redirects = JSON.parse(data) as Redirects;

        const targetUrl = qrId === '1' ? redirects.qr1 : redirects.qr2;

        if (targetUrl) {
            return NextResponse.redirect(targetUrl);
        }

        return new Response('Not Found', { status: 404 });

    } catch (error) {
        console.error("[QR Redirect] Error:", error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
