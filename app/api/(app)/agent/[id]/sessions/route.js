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
    const sessions = data?.data?.map(session => {
      const lastActive = new Date(session.last_active);
      const createdAtTime = new Date(session.created_at);
      const formattedLastActive = lastActive.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).replace(/(am|pm)/i, (match) => match.toUpperCase());
      const createdAt = createdAtTime.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).replace(/(am|pm)/i, (match) => match.toUpperCase());
      return {
        ...session,
        last_active: formattedLastActive,
        created_at: createdAt
      };
    }) ?? [];


    return ok('Successfully fetched agent details.', sessions);
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
