
// src/app/api/auth/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from '@/lib/firebase/firebase-admin';

// Initialize the Firebase Admin App
getAdminApp();

/**
 * API route to handle session cookie management.
 * POST: Creates a session cookie from a Firebase ID token.
 * DELETE: Clears the session cookie.
 */

// POST handler for creating a session cookie (Sign-in)
export async function POST(request: Request) {
    const authorization = request.headers.get("Authorization");

    if (authorization?.startsWith("Bearer ")) {
        const idToken = authorization.split("Bearer ")[1];
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

        try {
            // Get the Firebase Admin Auth instance.
            const auth = getAuth();

            // Create the session cookie from the ID token.
            const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

            // Set the cookie on the response.
            cookies().set("__session", sessionCookie, { 
                maxAge: expiresIn, 
                httpOnly: true, 
                secure: true, // Always use secure cookies in production
                path: '/'
            });

            return NextResponse.json({ status: "success" });
        } catch (error) {
            console.error('Error creating session cookie:', error);
            return new Response(JSON.stringify({ error: 'Failed to create session' }), { status: 401 });
        }
    } else {
        return new Response(JSON.stringify({ error: 'Authorization header not found' }), { status: 400 });
    }
}

// DELETE handler for clearing the session cookie (Sign-out)
export async function DELETE() {
    try {
        // Clear the __session cookie.
        cookies().set("__session", "", { maxAge: 0, path: '/' });
        return NextResponse.json({ status: "success" });
    } catch (error) {
        console.error('Error clearing session cookie:', error);
        return new Response(JSON.stringify({ error: 'Failed to clear session' }), { status: 500 });
    }
}
