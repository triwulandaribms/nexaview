import { headers } from 'next/headers';
import axios from 'axios';
import { fail, normalizeAxiosError, ok } from '@/app/lib/utils';

export async function POST(req, { params }) {
  const { id } = await params;
  const baseURL = process.env.API_BASE_URL;

  if (!baseURL) return fail('Server configuration error: Base URL is missing. Please contact the administrator.', 500);

  const reqHeaders = await headers();
  const token = reqHeaders.get('Authorization')?.replace('Bearer ', '');

  const body = await req.json();

  try {
    const { data } = await axios.post(`${baseURL}/api/agent/${id}/chat`, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
      timeout: 30_000,
      validateStatus: s => s >= 200 && s < 300, // Validate the response status
    });

    const agent = data?.data ?? data ?? {};

    return ok('Message successfully sent and agent session details fetched.', agent);
  } catch (err) {
    const { code, msg } = normalizeAxiosError(err, 'Failed to send message and fetch agent session details.');
    return fail(msg || 'An error occurred while sending the message or fetching agent data. Please try again.', code);
  }
}

