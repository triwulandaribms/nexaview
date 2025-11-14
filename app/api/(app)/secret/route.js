export async function GET() {
  try {
    const response = await fetch(
      "https://api.elevenlabs.io/v1/convai/secrets",
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
    console.error("Error fetching secrets:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, value, type = "string" } = body;

    const response = await fetch(
      "https://api.elevenlabs.io/v1/convai/secrets",
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: type,
          name: name,
          value: value,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error: ${response.status}`, errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("ElevenLabs POST response:", data);
    console.log("Response keys:", Object.keys(data));
    return Response.json(data);
  } catch (error) {
    console.error("Error creating secret:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
