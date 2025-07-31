import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      )
    }

    // Send login request to external API
    const { data } = await axios.post(
      'https://nexaai-v2-api-gen.ifabula.id/api/auth/login',
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    console.log('Login response:', data)

    // Extract tokens and user data (adapt this if the structure changes)
    const accessToken = data?.access_token
    const idToken = data?.id_token
    const user = data?.user || null

    // Validate presence of tokens
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Access token is missing in response.' },
        { status: 500 }
      )
    }

    // Build response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user
    })

    // Set secure cookies
    const cookieOptions = {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    }

    response.cookies.set('token', accessToken, cookieOptions)

    if (idToken) {
      response.cookies.set('id_token', idToken, cookieOptions)
    }

    return response

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
