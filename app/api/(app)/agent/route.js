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
        // console.log(data , " check data nya apa yah yah ");

        // const transformed = (Array.isArray(data) ? data : []).map((item) => ({
        //     ...item,
        //     created_at: formatDate(item.created_at),
        //     updated_at: formatDate(item.updated_at),
        // }));

        return ok('Fetched model list successfully.', data.data ?? []);
    } catch (err) {
        const { code, msg } = normalizeAxiosError(err, 'Failed to fetch models');
        return fail(msg, code);
    }
}


export async function POST(request) {

    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) return fail('Server configuration error. Please contact administrator.', 500);


    const cookieStore = await cookies();

    const token = cookieStore.get('token')?.value;
    const idToken = cookieStore.get('id_token')?.value;
    const formData = await request.formData();

    try {
        const { data } = await axios.post(`${baseURL}/api/dataset`, formData, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token || ''}`,
                'x-id-token': idToken || ''
            },
            timeout: 30_000,
            validateStatus: s => s >= 200 && s < 300,
        });

        return ok('Dataset successfully uploaded.', data);
    } catch (err) {
        console.log("Erro post dataset = >>> ", err?.message);

        const { code, msg } = normalizeAxiosError(err, 'Failed to upload dataset');

        return fail(msg, code);
    }
}
