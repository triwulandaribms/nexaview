import { cookies } from 'next/headers';
import axios from 'axios';
import { fail, normalizeAxiosError, ok } from '@/app/lib/utils';

export async function GET(_req, { params }) {
  const { id } = await params;
  const baseURL = process.env.API_BASE_URL;
  if (!baseURL) return fail('Server configuration error. Please contact administrator.', 500);

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const idToken = cookieStore.get('id_token')?.value;

  try {
    const { data } = await axios.get(`${baseURL}/api/agent/${id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
        'x-id-token': idToken || '',
      },
      timeout: 30_000,
      validateStatus: s => s >= 200 && s < 300,
    });

    const agent = data?.data ?? data ?? {};



    return ok('Fetched agent detail successfully.', agent);
  } catch (err) {
    const { code, msg } = normalizeAxiosError(err, 'Failed to fetch agent detail');
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
    const { data } = await axios.put(`${baseURL}/api/agent/${id}`, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
        'x-id-token': idToken || '',
      },
      timeout: 30_000,
      validateStatus: s => s >= 200 && s < 300,
    });

    return ok('Agent updated successfully.', data);
  } catch (err) {
    const { code, msg } = normalizeAxiosError(err, 'Failed to update agent');
    return fail(msg, code);
  }
}

export async function DELETE(_req, { params }) {
  const { id } = await params;
  const baseURL = process.env.API_BASE_URL;
  if (!baseURL) return fail('Server configuration error. Please contact administrator.', 500);

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const idToken = cookieStore.get('id_token')?.value;

  try {
    await axios.delete(`${baseURL}/api/agent/${id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
        'x-id-token': idToken || '',
      },
      timeout: 30_000,
      validateStatus: s => s >= 200 && s < 300,
    });

    return ok('Agent deleted successfully.', null);
  } catch (err) {
    const { code, msg } = normalizeAxiosError(err, 'Failed to delete agent');
    return fail(msg, code);
  }
}
