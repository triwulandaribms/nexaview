import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // Validasi input
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required fields.' },
        { status: 400 }
      );
    }

    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) {
      console.error('API_BASE_URL is not defined.');
      return NextResponse.json(
        { success: false, error: 'Internal config error (API URL).' },
        { status: 500 }
      );
    }

    // Kirim data ke API eksternal
    const { data } = await axios.post(
      `${baseURL}/api/auth/register`,
      {
        first_name: name,
        last_name: "",
        email,
        password,
        mobile_number: null,
        mu_mr_id: null
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const token = data?.token;
    const user = data?.user;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token missing from response.' },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Registration successful.',
      user
    });

    // Set token cookie (optional)
    const cookieOptions = {
      httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: parseInt(process.env.COOKIE_MAX_AGE || '604800', 10) // 7 days
    };

    response.cookies.set('token', token, cookieOptions);
    response.cookies.set('client_token', token, {
      ...cookieOptions,
      httpOnly: false
    });

    return response;

  } catch (error) {
    console.error('Signup error:', error?.response?.data || error.message);

    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errData = error.response.data;

      return NextResponse.json(
        {
          success: false,
          error: errData?.error || 'Registration failed.',
          detail: errData
        },
        { status }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}
