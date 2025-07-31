import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = cookies();

    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) {
      console.error('API_BASE_URL is not defined in .env.local');
      return NextResponse.json(
        { success: false, error: 'Missing API base URL.' },
        { status: 500 }
      );
    }

    const accessToken = cookieStore.get('token')?.value;
    const idToken = cookieStore.get('id_token')?.value;

    // Kirim request logout ke API eksternal
    await axios.post(`${baseURL}/api/auth/logout`, null, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken || ''}`,
        'x-id-token': idToken || ''
      }
    });

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // Expire immediately
    };

    // Hapus semua token cookie
    response.cookies.set('token', '', cookieOptions);
    response.cookies.set('id_token', '', cookieOptions);
    response.cookies.set('client_token', '', {
      ...cookieOptions,
      httpOnly: false
    });

    return response;

  } catch (error) {
    console.error('Login error:', error?.response?.data || error.message)

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500
      const apiError = error.response?.data?.error || 'Login failed'
      return NextResponse.json(
        { success: false, error: apiError },
        { status }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Unexpected server error' },
      { status: 500 }
    )
  }
}
