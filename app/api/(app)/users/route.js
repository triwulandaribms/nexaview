import { cookies } from 'next/headers';
import axios from 'axios';
import { ok, fail, normalizeAxiosError, } from '@/app/lib/utils';

export async function GET() {
    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) return fail("Server configuration error. Please contact administrator.", 500);
    console.log(baseURL, " chekec isinya apa yah ");

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
        // console.log(list);

        const users = list.map((user, index) => ({
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            role: user.role,
            created_at: new Date().toISOString().split('T')[0]
        }));

        return ok("Fetched dataset list successfully.", users);
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
