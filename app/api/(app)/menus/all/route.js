import { cookies } from 'next/headers';
import axios from 'axios';
import { fail, normalizeAxiosError, ok } from '@/app/lib/utils';

export async function GET() {
    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) {
        return NextResponse.json(
            { error: 'Server configuration error.' },
            { status: 500 }
        );
    }

    const cookieStore = await cookies();

    const token = cookieStore.get('acces_token')?.value;
    const idToken = cookieStore.get('id_token')?.value;

    if (!token) return fail('Unauthorized', 401);

    try {
        const { data } = await axios.get(`${baseURL}/api/main-menus`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'x-id-token': idToken || '',
            },
            timeout: 30_000,
            validateStatus: s => s >= 200 && s < 300,
        });

        console.log(data);

        const menu = data.mainMenus ?? [];

        return ok('Fetched main menus successfully.', menu);
    } catch (err) {
        const { code, msg } = normalizeAxiosError(err, 'Failed to fetch menus');
        return fail(msg, code);
    }
}
