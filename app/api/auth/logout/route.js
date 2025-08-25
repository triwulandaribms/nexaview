import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const cookieOptions = {
  httpOnly: process.env.COOKIE_HTTP_ONLY === "true",
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 0,
};

export async function POST() {
  let response;  
  try {
    const cookieStore = await cookies(); 
    const baseURL = process.env.API_BASE_URL;

    const accessToken = await cookieStore.get("token");
    const idToken = await cookieStore.get("id_token");

    if (!accessToken || !idToken) {
      return NextResponse.json({
        success: false,
        message: "Tokens are missing",
      }, { status: 400 });
    }

    await axios.post(`${baseURL}/api/auth/logout`, null, {
      headers: {
        Authorization: `Bearer ${accessToken.value || ''}`,
        'x-id-token': idToken.value || ''
      }
    });

    response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    response.cookies.set("token", "", cookieOptions);
    response.cookies.set("id_token", "", cookieOptions);
    response.cookies.set("acces_token", "", cookieOptions);

    return response;
  } catch (error) {
    console.log("Error response: ", error?.response);

    if (error?.response?.status === 403) {
      response = NextResponse.json({
        success: false,
        error: "Forbidden - logout failed",
      });
      response.cookies.set("token", "", cookieOptions);
      response.cookies.set("id_token", "", cookieOptions);
      response.cookies.set("acces_token", "", cookieOptions);
      return response;
    }

    return NextResponse.json(
      {
        success: false,
        error: "Logout failed or server error",
        detail: error?.response?.data || null,
      },
      { status: error?.response?.status || 500 }
    );
  }
}
