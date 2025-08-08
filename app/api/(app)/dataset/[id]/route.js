import { cookies } from 'next/headers';
import axios from 'axios';
import { deriveTypeSimple, fail, formatDate, formatFileSize, normalizeAxiosError, ok } from '@/app/lib/utils';

export async function GET(_req, { params }) {
    const { id } = await params;
    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) return fail("Server configuration error. Please contact administrator.", 500);

    try {
        const { data } = await axios.get(`${baseURL}/api/dataset/${id}`, {
            headers: { Accept: 'application/json' },
            timeout: 30_000,
            validateStatus: s => s >= 200 && s < 300,
        });
        const mapped = {
            ...data,
            file_size: formatFileSize(data.file_size),
            updated_at: formatDate(data.updated_at),
            created_at: formatDate(data.created_at),
            type: deriveTypeSimple({
                file_type: data.file_type,
                name: null,
                filename: data.filename,
            }),
        };
        return ok("Successfully fetched dataset detail.", mapped);
    } catch (err) {
        const { code, msg } = normalizeAxiosError(err, "Failed to fetch dataset detail");
        return fail(msg, code);
    }
}

export async function PUT(request, { params }) {
    const { id } = await params;
    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) return fail('Konfigurasi server salah. Hubungi administrator.', 500);

    // const token = cookies().get('token')?.value;
    const body = await request.json();

    try {
        const { data } = await axios.put(`${baseURL}/api/dataset/${id}`, body, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                // ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    const { id } = await params;
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
