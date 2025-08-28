
export async function request(path, { method = 'GET', body, headers, signal, cache } = {}) {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

    const token = localStorage.getItem("token");
    
    const res = await fetch(path, {
        method,
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            ...(isFormData ? {} : body ? { 'Content-Type': 'application/json' } : {}),
            ...(headers || {}),
        },
        body: isFormData ? body : body ? JSON.stringify(body) : undefined,
        signal,
        ...(cache ? { cache } : {}),
    });

    let json = null;
    try { json = await res.json(); } catch { }

    if (res.status == 403) {
        const msg = json?.error || 'Access forbidden. Please check your permissions.';
        const err = new Error(msg);
        err.status = res.status;
        err.body = json;


        document.cookie = "token=; path=/; max-age=0;";
        document.cookie = "id_token=; path=/; max-age=0;";

        throw err;
    }
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
