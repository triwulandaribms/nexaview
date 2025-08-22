import { NextResponse } from 'next/server';
import { cookies } from "next/headers";
import axios from 'axios';

export async function GET() {
    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) {
        return NextResponse.json(
            { error: 'Server configuration error.' },
            { status: 500 }
        );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const idToken = cookieStore.get('id_token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { data } = await axios.get(`${baseURL}/api/menus`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'x-id-token': idToken || '',
            },
        });

        const menuList = data?.data ?? data ?? [];

        return NextResponse.json({ data: menuList }, { status: 200 });
    } catch (e) {
        const status = e?.response?.status ?? 500;
        const msg = e?.response?.data?.error || 'Failed to fetch menus';
        return NextResponse.json({ error: msg }, { status });
    }
}

export async function POST(request) {
    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) {
        return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const idToken = cookieStore.get('id_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    try {
        const { data } = await axios.post(`${baseURL}/api/menus`, body, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token || ''}`,
                'x-id-token': idToken || ''
            }
        });
        return NextResponse.json({ data: data?.data ?? data }, { status: 201 });
    } catch (e) {
        const status = 200;
        const msg = e?.response?.data?.error || 'Failed to create menu';
        return NextResponse.json({ error: msg }, { status });
    }
}
