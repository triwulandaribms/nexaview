import { headers } from 'next/headers';
import axios from 'axios';
import { fail, normalizeAxiosError, ok } from '@/app/lib/utils';

export async function GET(_req, { params }) {
  const { id } = await params;
  const baseURL = process.env.API_BASE_URL;
  if (!baseURL) return fail('Server configuration error. Please contact the administrator.', 500);

  const reqHeaders = await headers();
  const token = reqHeaders.get('Authorization')?.replace('Bearer ', '');

  try {
    const { data } = await axios.get(`${baseURL}/api/agent/${id}/sessions`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
      timeout: 30_000,
      validateStatus: s => s >= 200 && s < 300,
    });

    const agent = data?.data ?? data ?? {};

    return ok('Successfully fetched agent details.', agent);
  } catch (err) {
    const { code, msg } = normalizeAxiosError(err, 'Failed to fetch agent list sessions');
    return fail(msg || 'An error occurred while fetching agent data', code);
  }
}

export async function POST(req, { params }) {
  const { id } = await params;
  const baseURL = process.env.API_BASE_URL;
  if (!baseURL) return fail('Server configuration error. Please contact the administrator.', 500);

  const reqHeaders = await headers();
  const token = reqHeaders.get('Authorization')?.replace('Bearer ', '');

  const body = await req.json();

  try {
    const { data } = await axios.post(`${baseURL}/api/agent/${id}/sessions`, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
      timeout: 30_000,
      validateStatus: s => s >= 200 && s < 300,
    });

    return ok('Session created successfully.', data);
  } catch (err) {
    const { code, msg } = normalizeAxiosError(err, 'Failed to create session');
    return fail(msg || 'An error occurred while creating the session', code);
  }
}
