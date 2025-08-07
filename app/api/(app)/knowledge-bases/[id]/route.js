import { cookies } from 'next/headers';
import axios from 'axios';
import { fail, normalizeAxiosError, ok } from '@/app/lib/utils';

export async function GET(_req, { params }) {
  const { id } = params;
  const baseURL = process.env.API_BASE_URL;
  if (!baseURL) return fail('Server configuration error. Please contact administrator.', 500);

  try {
    const { data } = await axios.get(`${baseURL}/api/knowledge_bases/${id}`, {
      headers: { Accept: 'application/json' },
      timeout: 30_000,
      validateStatus: s => s >= 200 && s < 300,
    });

    return ok('Fetched knowledge base detail successfully.', data);
  } catch (err) {
    const { code, msg } = normalizeAxiosError(err, 'Failed to fetch detail');
    return fail(msg, code);
  }
}

/* ------------ PUT /api/knowledge_bases/:id ------------ */
export async function PUT(req, { params }) {
  const { id } = params;
  const baseURL = process.env.API_BASE_URL;
  if (!baseURL) return fail('Server configuration error. Please contact administrator.', 500);

  const token = cookies().get('token')?.value; // optional auth
  const body = await req.json();

  try {
    const { data } = await axios.put(`${baseURL}/api/knowledge_bases/${id}`, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

/* ------------ DELETE /api/knowledge_bases/:id ------------ */
export async function DELETE(_req, { params }) {
  const { id } = await params;
  const baseURL = process.env.API_BASE_URL;
  if (!baseURL) return fail('Server configuration error. Please contact administrator.', 200);

  const token = cookies().get('token')?.value;

  try {
    await axios.delete(`${baseURL}/api/knowledge_bases/${id}`, {
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
