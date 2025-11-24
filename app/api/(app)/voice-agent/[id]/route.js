import axios from "axios";

const BASE_URL = "https://api.elevenlabs.io/v1/convai";

export async function GET(req, { params }) {
  const { id } = await params;

  if (!id || id === "undefined") {
    console.error("Invalid agent ID:", id);
    return new Response(
      JSON.stringify({ error: "Invalid or missing agent ID" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const resp = await axios.get(`${BASE_URL}/agents/${id}`, {
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
    });
    return new Response(JSON.stringify(resp.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("GET agent error:", err.response?.data || err.message);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch agent",
        details: err.response?.data || err.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function PATCH(req, { params }) {
  const { id } = await params;

  if (!id || id === "undefined") {
    console.error("Invalid agent ID:", id);
    return new Response(
      JSON.stringify({ error: "Invalid or missing agent ID" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const body = await req.json();
    const resp = await axios.patch(`${BASE_URL}/agents/${id}`, body, {
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
    });

    return new Response(JSON.stringify(resp.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("PATCH agent error:", err.response?.data || err.message);
    return new Response(
      JSON.stringify({
        error: "Failed to update agent",
        details: err.response?.data || err.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;

  if (!id || id === "undefined") {
    console.error("Invalid agent ID:", id);
    return new Response(
      JSON.stringify({ error: "Invalid or missing agent ID" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const resp = await axios.delete(`${BASE_URL}/agents/${id}`, {
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
      },
    });

    return new Response(
      JSON.stringify({ success: true, message: "Agent deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("DELETE agent error:", err.response?.data || err.message);
    return new Response(
      JSON.stringify({
        error: "Failed to delete agent",
        details: err.response?.data || err.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
