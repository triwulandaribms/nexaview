export async function GET(request, { params }) {
  const { voiceId } = await params;

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/voices/${voiceId}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching voice:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const { voiceId } = await params;

  try {
    const incoming = await request.formData();
    const apiForm = new FormData();

    if (incoming.get("stability")) {
      apiForm.append("stability", incoming.get("stability"));
    }
    if (incoming.get("similarity_boost")) {
      apiForm.append("similarity_boost", incoming.get("similarity_boost"));
    }
    if (incoming.get("speed")) {
      apiForm.append("speed", incoming.get("speed"));
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/voices/${voiceId}/edit`,
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          ...apiForm.getHeaders(),
        },
        body: apiForm,
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return Response.json(await response.json());
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
