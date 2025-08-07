import { cookies } from 'next/headers';
import axios from 'axios';
import { fail, normalizeAxiosError, ok } from '@/app/lib/utils';

export async function GET(_req, { params }) {
    const { id } = await params;
    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) return fail('Konfigurasi server salah. Hubungi administrator.', 500);

    try {
        const { data } = await axios.get(`${baseURL}/api/dataset/${id}`, {
            headers: { Accept: 'application/json' },
            timeout: 30_000,
            validateStatus: s => s >= 200 && s < 300,
        });

        return ok('Berhasil mengambil detail dataset.', data);
    } catch (err) {
        const { code, msg } = normalizeAxiosError(err, 'Gagal mengambil detail');
        return fail(msg, code);
    }
}

export async function PUT(request, { params }) {
    const { id } = params;
    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) return fail('Konfigurasi server salah. Hubungi administrator.', 500);

    const token = cookies().get('token')?.value;
    const body = await request.json();

    try {
        const { data } = await axios.put(`${baseURL}/api/dataset/${id}`, body, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            timeout: 30_000,
            validateStatus: s => s >= 200 && s < 300,
        });

        return ok('Dataset berhasil diperbarui.', data);
    } catch (err) {
        const { code, msg } = normalizeAxiosError(err, 'Gagal memperbarui dataset');
        return fail(msg, code);
    }
}

export async function DELETE(_req, { params }) {
    const { id } = params;
    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) return fail('Konfigurasi server salah. Hubungi administrator.', 500);

    const token = cookies().get('token')?.value;

    try {
        await axios.delete(`${baseURL}/api/dataset/${id}`, {
            headers: {
                Accept: 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            timeout: 30_000,
            validateStatus: s => s >= 200 && s < 300,
        });

        return ok('Dataset berhasil dihapus.', null);
    } catch (err) {
        const { code, msg } = normalizeAxiosError(err, 'Gagal menghapus dataset');
        return fail(msg, code);
    }
}
