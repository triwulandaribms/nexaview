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
    console.log(baseURL, " <====");

    // Kirim data ke API eksternal
    await axios.post(
      `${baseURL}/api/users`,
      {
        full_name: name,
        email,
        password,
        confirm_password: password
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // const token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJQWDFXc21sc3MtY2YtcW9qTEFhNE9wblp3dUhyb2RrQnlRUXFjUmc3MlY4In0.eyJleHAiOjE3NTQwMTYxODEsImlhdCI6MTc1NDAxNTg4MSwianRpIjoib25ydHJvOmVlMTk3YmI4LWE5MzUtZDgzMi1hZGFmLWQxYzI2YTcyOTcwYyIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9yZWFsbXMvbXlyZWFsbSIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYnJva2VyIiwiYWNjb3VudCJdLCJzdWIiOiI4YzNmY2U3ZC1kNmQ0LTQ1MTEtOGVkMS05MjU2ZmYxMjBmMzgiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJteWNsaWVudCIsInNpZCI6IjFmNjcyNzU5LTM5MzYtNGQ3OS05YTQ5LTFhOGMxYzExNWQxNiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly9uZXhhYWktdjItYXBpLWdlbi5pZmFidWxhLmlkIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLW15cmVhbG0iLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsicmVhbG0tbWFuYWdlbWVudCI6eyJyb2xlcyI6WyJ2aWV3LXJlYWxtIiwidmlldy1pZGVudGl0eS1wcm92aWRlcnMiLCJtYW5hZ2UtaWRlbnRpdHktcHJvdmlkZXJzIiwiaW1wZXJzb25hdGlvbiIsInJlYWxtLWFkbWluIiwiY3JlYXRlLWNsaWVudCIsIm1hbmFnZS11c2VycyIsInF1ZXJ5LXJlYWxtcyIsInZpZXctYXV0aG9yaXphdGlvbiIsInF1ZXJ5LWNsaWVudHMiLCJxdWVyeS11c2VycyIsIm1hbmFnZS1ldmVudHMiLCJtYW5hZ2UtcmVhbG0iLCJ2aWV3LWV2ZW50cyIsInZpZXctdXNlcnMiLCJ2aWV3LWNsaWVudHMiLCJtYW5hZ2UtYXV0aG9yaXphdGlvbiIsIm1hbmFnZS1jbGllbnRzIiwicXVlcnktZ3JvdXBzIl19LCJicm9rZXIiOnsicm9sZXMiOlsicmVhZC10b2tlbiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsInZpZXctYXBwbGljYXRpb25zIiwidmlldy1jb25zZW50Iiwidmlldy1ncm91cHMiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsImRlbGV0ZS1hY2NvdW50IiwibWFuYWdlLWNvbnNlbnQiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJTdXBlciBBZG1pbiIsInByZWZlcnJlZF91c2VybmFtZSI6InN1cGVyYWRtaW5AZXhhbXBsZS5jb20iLCJnaXZlbl9uYW1lIjoiU3VwZXIiLCJmYW1pbHlfbmFtZSI6IkFkbWluIiwiZW1haWwiOiJzdXBlcmFkbWluQGV4YW1wbGUuY29tIn0.d5oNbv2PmdgU6oZ8H9jL_J4CC6LeMb48K3EDO0kMytavjehFK_CR3dqVzmF1-Ddkda2UwdBb0aaQLc6tN2mGX3Xt4e9l_OoASOYHt53TwZKqNs7vWQ2wQkMLAPJtEU6yxL-fYOYtTyU7Ons_H8zA9MdB4zw5HZWKWL9nYoXWyBmzV7nIQoYLmgOmg642V11ImOhHakM45ObImXfrhJUeuHCssOo_-D4PobihmF6iTqGKvulyi8HZpFOwrjhuCDxLtTFh2yQ6ncuaySd3az-Kdlq30cgIO_Mb34w4pX_pJntBGTFPm0rQKu3aGLHDqFWqeMj5KY6cHXyaNNY3aLmQWg";
    // const user = {
    //   name : "ali hanafiah "
    // };

    // if (!token) {
    //   return NextResponse.json(
    //     { success: false, error: 'Token missing from response.' },
    //     { status: 500 }
    //   );
    // }

    const response = NextResponse.json({
      success: true,
      message: 'Registration successful.',
      // user
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

    return response;

  } catch (error) {
    console.error('Signup error ==>>> ', error?.response || error.message);

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
