import { NextRequest, NextResponse } from 'next/server';

const X_USER_INFO_URL = 'https://api.twitter.com/2/users/me';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      console.error('Invalid authorization header format');
      return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }

    const accessToken = authHeader.split(' ')[1];
    const userInfoResponse = await fetch(X_USER_INFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userInfoResponse.ok) {
      const errorText = await userInfoResponse.text();
      console.error('Failed to fetch user info:', {
        status: userInfoResponse.status,
        statusText: userInfoResponse.statusText,
        error: errorText,
        headers: Object.fromEntries(userInfoResponse.headers.entries()),
      });
      return NextResponse.json({ error: 'Failed to fetch user info' }, { status: userInfoResponse.status });
    }

    const userData = await userInfoResponse.json();

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
