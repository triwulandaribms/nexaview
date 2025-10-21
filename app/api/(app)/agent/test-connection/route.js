import { headers } from 'next/headers';
import axios from 'axios';
import { ok, fail, normalizeAxiosError, formatDate, } from '@/app/lib/utils';

export async function POST(req) {

    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) return fail("Server configuration error. Please contact administrator.", 500);

    let body = {};
    try { body = await req.json(); } catch { body = {}; }

    try {
        const reqHeaders = await headers();
        const token = reqHeaders.get('Authorization')?.replace('Bearer ', '');

        const { data } = await axios.post(`${baseURL}/api/agent/test-db-connection`, body, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token || ""}`,
            },
            timeout: 60_000,
            validateStatus: (s) => s >= 200 && s < 300,
        });
        return ok("Database connection successful.", data);
    } catch (err) {
        const { code, msg } = normalizeAxiosError(err, "Failed to test database connection");
        return fail(`Error testing database connection: ${msg}`, code);
    }
}