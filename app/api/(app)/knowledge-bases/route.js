import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import axios from 'axios';
import { formatDate } from '@/app/lib/utils';

export async function GET() {
    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) {
        return NextResponse.json(
            { error: 'Server configuration error.' },
            { status: 500 }
        );
    }

    const reqHeaders = await headers();
    const token = reqHeaders.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(token);

    try {
        const { data } = await axios.get(`${baseURL}/api/knowledge_bases`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        const kbList = data?.data ?? data ?? [];

        const formatted = kbList.map((item) => ({
            ...item,
            created_at: formatDate(item.created_at),
            updated_at: formatDate(item.updated_at),
        }));

        return NextResponse.json({ data: formatted }, { status: 200 });
    } catch (e) {
        const status = e?.response?.status ?? 500;
        const msg = e?.response?.data?.message || 'Failed to fetch knowledge bases';
        return NextResponse.json({ error: msg }, { status });
    }
}

export async function POST(request) {

    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) {
        return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    const reqHeaders = await headers();
    const token = reqHeaders.get('Authorization')?.replace('Bearer ', '');


    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    try {
        const { data } = await axios.post(`${baseURL}/api/knowledge_bases`, body, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token || ''}`,
            }
        });
        return NextResponse.json({ data: data?.data ?? data }, { status: 201 });
    } catch (e) {
        const status = 200;
        const msg = e?.response?.data?.error || 'Failed to create';
        return NextResponse.json({ error: msg }, { status });
    }
}
