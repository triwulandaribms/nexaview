import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // Validasi input
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Please provide all required fields." },
        { status: 400 }
      );
    }

    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) {
      console.error("API_BASE_URL is not defined.");
      return NextResponse.json(
        { success: false, error: "Internal config error (API URL)." },
        { status: 500 }
      );
    }

    // Kirim data ke API eksternal
    await axios.post(
      `${baseURL}/api/users`,
      {
        full_name: name,
        email,
        password,
        
        confirm_password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Registration successful.",
    });

    // Set token cookie (optional)
    // const cookieOptions = {
    //   httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'lax',
    //   maxAge: parseInt(process.env.COOKIE_MAX_AGE || '604800', 10) // 7 days
    // };

    // response.cookies.set('token', token, cookieOptions);
    // response.cookies.set('client_token', token, {
    //   ...cookieOptions,
    //   httpOnly: false
    // });
  } catch (error) {
    console.error("Signup error ==>>> ", error?.response || error.message);
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const errData = error.response.data;

      if (status == 409) {
        return NextResponse.json(
          {
            success: false,
            error: "This email is unavailable, please replace it with another one.",
            detail: errData,
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: errData?.message || "Registration failed.",
          detail: errData,
        },
        { status }
      );
    }

    return NextResponse.json(
      { success: false, error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
