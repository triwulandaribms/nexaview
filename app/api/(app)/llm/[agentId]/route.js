export async function POST(request, { params }) {
  const { agentId } = await params;

  if (!agentId || agentId === "undefined") {
    console.error("Invalid agent ID:", agentId);
    return new Response(
      JSON.stringify({ error: "Invalid or missing agent ID" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/agent/${agentId}/llm-usage/calculate`,
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error calculating LLM usage:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to calculate LLM usage",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
