import { cookies } from 'next/headers';
import axios from 'axios';
import { ok, fail, normalizeAxiosError, formatDate } from '@/app/lib/utils';

const baseURL = process.env.API_BASE_URL;

export async function GET(_req, { params }) {
    const { id } = await params;

    if (!baseURL) return fail('Server configuration error. Please contact administrator.', 500);

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('access_token')?.value;
        const idToken = cookieStore.get('id_token')?.value;

        const { data } = await axios.get(`${baseURL}/api/roles/${id}`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token || ''}`,
                'x-id-token': idToken || ''
            },
            timeout: 30_000,
            validateStatus: s => s >= 200 && s < 300,
        });

        const transformed = {
            ...data?.data,
            created_at: formatDate(data?.data?.mr_created_at),
            updated_at: formatDate(data?.data?.mr_updated_at),
        };

        return ok('Fetched role details successfully.', transformed);
    } catch (err) {
        const { code, msg } = normalizeAxiosError(err, 'Failed to fetch role details');
        return fail(msg, code);
    }
}

export async function DELETE(_req, { params }) {
    const { id } = await params;
    if (!baseURL) return fail('Server configuration error. Please contact administrator.', 500);

    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    const idToken = cookieStore.get('id_token')?.value;

    try {
        await axios.delete(`${baseURL}/api/roles/${id}`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token || ''}`,
                'x-id-token': idToken || ''
            },
            timeout: 30_000,
            validateStatus: s => s >= 200 && s < 300,
        });

        return ok('Role successfully deleted.');
    } catch (err) {
        const { code, msg } = normalizeAxiosError(err, 'Failed to delete role');
        return fail(msg, code);
    }
}


export async function PUT(req, { params }) {
    const { id } = await params;
    if (!baseURL) return fail('Server configuration error. Please contact administrator.', 500);

    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    const idToken = cookieStore.get('id_token')?.value;

    try {
        const payload = await req.json();

        const { data } = await axios.put(`${baseURL}/api/roles/${id}`, payload, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token || ''}`,
                'x-id-token': idToken || ''
            },
            timeout: 30_000,
            validateStatus: s => s >= 200 && s < 300,
        });

        const transformed = {
            ...data?.data,
            created_at: formatDate(data?.data?.mr_created_at),
            updated_at: formatDate(data?.data?.mr_updated_at),
        };

        return ok('Role successfully updated.', transformed);
    } catch (err) {
        const { code, msg } = normalizeAxiosError(err, 'Failed to update role');
        return fail(msg, code);
    }
}