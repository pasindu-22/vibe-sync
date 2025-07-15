import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization');
  
  if (!token) {
    return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 });
  }

  try {
    const response = await fetch(`${BACKEND_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const token = request.headers.get('Authorization');
  
  if (!token) {
    return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_URL}/users/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}
