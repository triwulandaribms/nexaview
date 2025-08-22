import { cookies } from 'next/headers';
import axios from 'axios';
import { ok, fail, normalizeAxiosError } from '@/app/lib/utils';

export async function GET() {
    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) return fail("Server configuration error. Please contact administrator.", 500);

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        const idToken = cookieStore.get("id_token")?.value;

        const { data } = await axios.get(`${baseURL}/api/users`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token || ""}`,
                "x-id-token": idToken || "",
            },
            timeout: 30_000,
            validateStatus: (s) => s >= 200 && s < 300,
        });

        const list = Array.isArray(data) ? data : [];

        const users = list.map((user) => ({
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            role: user.role,
            created_at: new Date(user.created_at).toISOString().split('T')[0],
        }));

        return ok("Fetched users list successfully.", users);
    } catch (err) {
        const { code, msg } = normalizeAxiosError(err, "Failed to fetch users");
        return fail(msg, code);
    }
}

export async function POST(request) {
    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) return fail('Server configuration error. Please contact administrator.', 500);

    const cookieStore = await cookies();

    const token = cookieStore.get('token')?.value;
    const idToken = cookieStore.get('id_token')?.value;
    const body = await request.json();

    try {
        const { data } = await axios.post(`${baseURL}/api/users`, body, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token || ''}`,
                'x-id-token': idToken || ''
            },
            timeout: 30_000,
            validateStatus: s => s >= 200 && s < 300,
        });

        return ok('User successfully created.', data);
    } catch (err) {
        console.log("Error creating user = >>> ", err?.message);

        const { code, msg } = normalizeAxiosError(err, 'Failed to create user');
        return fail(msg, code);
    }
}
