import { cookies } from 'next/headers';
import axios from 'axios';
import { ok, fail, normalizeAxiosError } from '@/app/lib/utils';


const formatDate = (iso) => {
    if (!iso) return null;
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(iso));
};

export async function GET() {
    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) return fail('Server configuration error. Please contact administrator.', 500);

    try {
        const { data } = await axios.get(`${baseURL}/api/dataset`, {
            headers: { Accept: 'application/json' },
            timeout: 30_000,
            validateStatus: s => s >= 200 && s < 300,
        });

        const transformed = (Array.isArray(data) ? data : []).map((item) => ({
            ...item,
            created_at: formatDate(item.created_at),
            updated_at: formatDate(item.updated_at),
        }));
        return ok('Fetched dataset list successfully.', transformed ?? []);
    } catch (err) {
        const { code, msg } = normalizeAxiosError(err, 'Failed to fetch datasets');
        return fail(msg, code);
    }
}


export async function POST(request) {
    
    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) return fail('Konfigurasi server salah. Hubungi administrator.', 500);

    //   const token = cookies().get('token')?.value;

    const formData = await request.formData();

    try {
        const { data } = await axios.post(`${baseURL}/api/dataset`, formData, {
            headers: {
                Accept: 'application/json',
                // ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            timeout: 30_000,
            validateStatus: s => s >= 200 && s < 300,
        });

        return ok('Dataset berhasil diunggah.', data);
    } catch (err) {
        const { code, msg } = normalizeAxiosError(err, 'Gagal mengunggah dataset');
        return fail(msg, code);
    }
}
