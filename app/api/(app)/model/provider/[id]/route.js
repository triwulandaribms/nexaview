import { cookies } from "next/headers";
import axios from "axios";
import { ok, fail, normalizeAxiosError } from "@/app/lib/utils";

export async function PUT(req, { params }) {
    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) return fail("Server configuration error. Please contact administrator.", 500);

    const id = await params?.id;
    if (!id) return fail("Missing provider id.", 400);

    let body = {};
    try {
        body = await req.json();
    } catch {
        body = {};
    }

    if (body.apiKey && body.api_key === undefined) {
        body.api_key = body.apiKey;
        delete body.D;
    }

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const { data } = await axios.put(
            `${baseURL}/api/model/provider/${encodeURIComponent(id)}/api-key`,
            body,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token || ""}`,
                },
                timeout: 30_000,
                validateStatus: (s) => s >= 200 && s < 300,
            }
        );

        return ok("Provider updated successfully.", data);
    } catch (err) {
        console.log(err, " chek cok");

        const { code, msg } = normalizeAxiosError(err, "Failed to update provider");
        return fail(msg, code);
    }
}
