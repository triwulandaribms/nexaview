export async function GET() {
  try {
    const response = await fetch("https://api.elevenlabs.io/v1/convai/agents", {
      method: "GET",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
