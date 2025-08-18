import { cookies } from 'next/headers';
import axios from 'axios';
import { fail, formatDate, normalizeAxiosError, ok } from '@/app/lib/utils';

export async function GET(_req, { params }) {
  const { id } = await params;
  const baseURL = process.env.API_BASE_URL;
  if (!baseURL) return fail('Server configuration error. Please contact administrator.', 500);

  const cookieStore = await cookies();

  const token = cookieStore.get('token')?.value;
  const idToken = cookieStore.get('id_token')?.value;
  try {
    const { data } = await axios.get(`${baseURL}/api/users/${id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
        'x-id-token': idToken || ''
      },
      timeout: 30_000,
      validateStatus: s => s >= 200 && s < 300,
    });

    const kb = data?.data ?? data ?? {};

    const transformed = {
      ...kb,
      created_at: formatDate(kb.created_at),
      updated_at: formatDate(kb.updated_at),
      documents: (kb?.documents || []).map(doc => ({
        ...doc,
        created_at: formatDate(doc.created_at),
        updated_at: formatDate(doc.updated_at),
      })),
    };

    return ok('Fetched knowledge base detail successfully.', transformed);
  } catch (err) {
    const { code, msg } = normalizeAxiosError(err, 'Failed to fetch detail');
    return fail(msg, code);
  }
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const baseURL = process.env.API_BASE_URL;
  if (!baseURL) return fail('Server configuration error. Please contact administrator.', 500);

  const cookieStore = await cookies();

  const token = cookieStore.get('token')?.value;
  const idToken = cookieStore.get('id_token')?.value;
  const body = await req.json();

  try {
    const { data } = await axios.put(`${baseURL}/api/knowledge_bases/${id}`, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
        'x-id-token': idToken || ''
      },
      timeout: 30_000,
      validateStatus: s => s >= 200 && s < 300,
    });
    return ok('Knowledge base updated successfully.', data);
  } catch (err) {
    const { code, msg } = normalizeAxiosError(err, 'Failed to update');
    return fail(msg, code);
  }
}

export async function DELETE(_req, { params }) {
  const { id } = await params;
  const baseURL = process.env.API_BASE_URL;
  if (!baseURL) return fail('Server configuration error. Please contact administrator.', 200);

  const cookieStore = await cookies();

  const token = cookieStore.get('token')?.value;
  const idToken = cookieStore.get('id_token')?.value;

  try {
    await axios.delete(`${baseURL}/api/knowledge_bases/${id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
        'x-id-token': idToken || ''
      },
      timeout: 30_000,
      validateStatus: s => s >= 200 && s < 300,
    });

    return ok('Knowledge base deleted successfully.', null);
  } catch (err) {
    const { code, msg } = normalizeAxiosError(err, 'Failed to delete');
    return fail(msg, 200);
  }
}
