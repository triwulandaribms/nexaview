
export async function request(path, { method = 'GET', body, headers, signal, cache } = {}) {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

    const res = await fetch(path, {
        method,
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            ...(isFormData ? {} : body ? { 'Content-Type': 'application/json' } : {}),
            ...(headers || {}),
        },
        body: isFormData ? body : body ? JSON.stringify(body) : undefined,
        signal,
        ...(cache ? { cache } : {}),
    });

    let json = null;
    try { json = await res.json(); } catch { }

    if (!res.ok) {

        const msg = json?.error || json?.message || res.statusText || 'Request failed';
        const err = new Error(msg);
        err.status = res.status;
        err.body = json;
        throw err;
    }

    return { data: json?.data ?? json ?? null, message: json?.message ?? 'OK', status: res.status };
}

export function withTimeout(ms = 15000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(new DOMException('Timeout', 'AbortError')), ms);
    return { signal: controller.signal, cancel: () => clearTimeout(id) };
}
