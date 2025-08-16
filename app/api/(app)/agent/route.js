import { cookies } from 'next/headers';
import axios from 'axios';
import { ok, fail, normalizeAxiosError, formatDate, } from '@/app/lib/utils';

export async function GET() {
    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) return fail('Server configuration error. Please contact administrator.', 500);

    try {

        const cookieStore = await cookies();

        const token = cookieStore.get('token')?.value;
        const idToken = cookieStore.get('id_token')?.value;

        const { data } = await axios.get(`${baseURL}/api/agent`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token || ''}`,
                'x-id-token': idToken || ''
            },
            timeout: 30_000,
            validateStatus: s => s >= 200 && s < 300,
        });
        return ok('Fetched model list successfully.', data.data ?? []);
    } catch (err) {
        const { code, msg } = normalizeAxiosError(err, 'Failed to fetch models');
        return fail(msg, code);
    }
}

export async function POST(req) {
    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) return fail("Server configuration error. Please contact administrator.", 500);

    let body = {};
    try { body = await req.json(); } catch { body = {}; }

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        const idToken = cookieStore.get("id_token")?.value;

        const { data } = await axios.post(`${baseURL}/api/agent`, body, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token || ""}`,
                "x-id-token": idToken || "",
            },
            timeout: 60_000,
            validateStatus: (s) => s >= 200 && s < 300,
        });

        return ok("All set! Your agent has been created.", data);
    } catch (err) {
        const { code, msg } = normalizeAxiosError(err, "Failed to create agent");
        return fail(msg, code);
    }
}