import { headers } from 'next/headers';
import axios from 'axios';
import { fail, normalizeAxiosError, ok } from '@/app/lib/utils';

export async function DELETE(req, { params }) {
  const { id, id_session } = await params;
  const baseURL = process.env.API_BASE_URL;

  if (!baseURL) return fail('Server configuration error. Please contact the administrator.', 500);

  const reqHeaders = await headers();
  const token = reqHeaders.get('Authorization')?.replace('Bearer ', '');

  try {
    const { data } = await axios.delete(`${baseURL}/api/agent/${id}/sessions/${id_session}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
      timeout: 30_000,
      validateStatus: s => s >= 200 && s < 300,
    });

    if (data?.error) throw new Error('Failed to delete session');

    return ok('Session deleted successfully.', data);
  } catch (err) {
    const { code, msg } = normalizeAxiosError(err, 'Failed to delete session');
    return fail(msg || 'An error occurred while deleting the session', code);
  }
}
