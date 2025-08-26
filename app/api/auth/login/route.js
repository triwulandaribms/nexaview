import axios from "axios";
import { NextResponse } from "next/server";


function generateCombinedString(id_token, token) {
  const combinedString = id_token + " " + token;
  const result = combinedString.split('').reverse().join('') + ' ' + Math.floor(Math.random() * 100000000);
  return result;
}

function restoreOriginalTokens(modifiedString) {
  const modifiedStringWithoutRandom = modifiedString.split(' ')[0];
  const originalString = modifiedStringWithoutRandom.split('').reverse().join('');
  const [id_token, token] = originalString.split(' ');
  return { id_token, token };
}

export async function POST(request) {
  try {
    // Ambil data dari body request
    const { email, password } = await request.json();

    // Validasi konfigurasi environment
    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) {
      console.error(
        "[CONFIG ERROR] Missing API_BASE_URL in environment variables."
      );
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error. Please contact administrator.",
        },
        { status: 500 }
      );
    }

    // Kirim permintaan login ke API eksternal
    const responseFromAPI = await axios.post(
      `${baseURL}/api/auth/login`,
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );

    const { access_token, id_token, token, user } = responseFromAPI.data;

    // Opsi cookie standar
    const baseCookieOptions = {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    };

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user,
    });

    response.cookies.set("token", token, {
      ...baseCookieOptions,
      httpOnly: false,
    });

    // response.cookies.set("acces_token", token, {
    //   ...baseCookieOptions,
    //   httpOnly: false,
    // });

    // response.cookies.set("id_token", id_token, {
    //   ...baseCookieOptions,
    //   httpOnly: false,
    // });

    return response;
  } catch (error) {
    console.error(
      "LOGIN ERROR =>>>> ",
      axios.isAxiosError(error) ? error.response?.data : error
    );

    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;

      if (statusCode === 401) {
        return NextResponse.json(
          { success: false, error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const message = error.response?.data?.error || "Authentication failed.";
      return NextResponse.json(
        { success: false, error: message },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
