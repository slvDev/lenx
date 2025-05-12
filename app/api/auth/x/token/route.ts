import { NextRequest, NextResponse } from 'next/server';

const X_TOKEN_URL = 'https://api.twitter.com/2/oauth2/token';

export async function POST(request: NextRequest) {
  try {
    const { code, code_verifier, redirect_uri } = await request.json();

    if (!code || !code_verifier || !redirect_uri) {
      console.error('Missing parameters:', {
        code: !!code,
        code_verifier: !!code_verifier,
        redirect_uri: !!redirect_uri,
      });
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_X_CLIENT_ID || !process.env.X_CLIENT_SECRET) {
      console.error('Missing required environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Create Basic Auth header
    const credentials = Buffer.from(`${process.env.NEXT_PUBLIC_X_CLIENT_ID}:${process.env.X_CLIENT_SECRET}`).toString(
      'base64'
    );

    // Prepare the token request
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      code_verifier,
      redirect_uri,
    });

    const tokenResponse = await fetch(X_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      },
      body: params.toString(),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorText,
        headers: Object.fromEntries(tokenResponse.headers.entries()),
      });
      return NextResponse.json({ error: 'Failed to exchange code for token' }, { status: tokenResponse.status });
    }

    const tokenData = await tokenResponse.json();

    // Return only the access token to the client
    // The refresh token (if any) should be stored securely on the server
    return NextResponse.json({
      access_token: tokenData.access_token,
    });
  } catch (error) {
    console.error('Error in token exchange:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
