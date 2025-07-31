import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = cookies();

    const baseURL = process.env.API_BASE_URL;

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
      httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
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
    console.error('Logout error:', error?.response?.data || error.message);

    return NextResponse.json(
      {
        success: false,
        error: 'Logout failed or server error',
        detail: error?.response?.data || null
      },
      { status: error?.response?.status || 500 }
    )
  }
}
