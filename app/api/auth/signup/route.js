import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(req) {
  try {
    const { name, email, password } = await req.json()

    // Validasi input
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required fields' },
        { status: 400 }
      )
    }

    // Kirim data ke API eksternal
    const { data } = await axios.post(
      'https://nexaai-v2-api-gen.ifabula.id/api/auth/register',
      {
        first_name: name,
        last_name: "",
        email,
        password,
        mobile_number: null,
        mu_mr_id: null,
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    const token = data.token
    const user = data.user

    const response = NextResponse.json({ success: true, user, token })

    // Set cookie token
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 hari
    })

    return response

  } catch (error) {
    console.error('Signup error:', error)

    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status
      const errData = error.response.data

      return NextResponse.json(
        {
          success: false,
          error: errData?.error || 'Registrasi gagal',
          detail: errData
        },
        { status }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Server error. Please try again.' },
      { status: 500 }
    )
  }
}
