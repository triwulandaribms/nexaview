import { cookies } from 'next/headers';
import axios from 'axios';
import { ok, fail, normalizeAxiosError, formatDate } from '@/app/lib/utils';

export async function GET() {
    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) return fail('Server configuration error. Please contact administrator.', 500);

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        const idToken = cookieStore.get('id_token')?.value;

        const { data } = await axios.get(`${baseURL}/api/roles`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token || ''}`,
                'x-id-token': idToken || ''
            },
            timeout: 30_000,
            validateStatus: s => s >= 200 && s < 300,
        });

        const transformed = (Array.isArray(data?.data) ? data?.data : []).map((item) => ({
            ...item,
            created_at: formatDate(item.mr_created_at),
            updated_at: formatDate(item.mr_updated_at),
        }));

        return ok('Fetched roles successfully.', transformed ?? []);
    } catch (err) {
        const { code, msg } = normalizeAxiosError(err, 'Failed to fetch roles');
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
        const { data } = await axios.post(`${baseURL}/api/roles`, body, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token || ''}`,
                'x-id-token': idToken || ''
            },
            timeout: 30_000,
            validateStatus: s => s >= 200 && s < 300,
        });

        return ok('Role successfully created.', data);
    } catch (err) {
        console.log("Error posting role = >>> ", err?.message);
        const { code, msg } = normalizeAxiosError(err, 'Failed to create role');
        return fail(msg, code);
    }
}
