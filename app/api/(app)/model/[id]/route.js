import { cookies } from "next/headers";
import axios from "axios";
import { ok, fail, normalizeAxiosError } from "@/app/lib/utils";

export async function PUT(req, { params }) {
    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) return fail("Server configuration error. Please contact administrator.", 500);

    const id = params?.id;
    if (!id) return fail("Missing model id.", 400);

    let body = {};
    try {
        body = await req.json();
    } catch {
        body = {};
    }

    if (typeof body.enabled === "boolean" && body.is_active === undefined) {
        body.is_active = body.enabled;
        delete body.enabled;
    }

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        const idToken = cookieStore.get("id_token")?.value;

        const { data } = await axios.put(`${baseURL}/api/model/${id}`, body, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token || ""}`,
                "x-id-token": idToken || "",
            },
            timeout: 30_000,
            validateStatus: (s) => s >= 200 && s < 300,
        });

        return ok("Model updated successfully.", data);
    } catch (err) {
        const { code, msg } = normalizeAxiosError(err, "Failed to update model");
        return fail(msg, code);
    }
}
