import { NextResponse } from 'next/server'
import axios from 'axios'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    // Ambil token dari cookie
    const cookieStore = cookies()
    const accessToken = cookieStore.get('access_token')?.value
    const idToken = cookieStore.get('id_token')?.value

    // Kirim request ke API logout eksternal dengan header yang benar
    await axios.post('https://nexaai-v2-api-gen.ifabula.id/api/auth/logout', null, {
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

    // Hapus semua cookie yang terkait auth
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    };

    response.cookies.set('token', '', cookieOptions);
    response.cookies.set('id_token', '', cookieOptions);

    return response;

  } catch (error) {
    console.error('Logout error:', error?.response?.data || error.message)

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
