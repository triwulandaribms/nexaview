// lib/knowledgeBaseApi.js
import { request } from './http';

const base = '/api/model';

export const mbApi = {
    list(opts) {
        return request(`${base}`, { method: 'GET', cache: 'no-store', ...(opts || {}) });
    },
    toggle(id, payload, opts) {

        return request(`${base}/${id.id}`, { method: 'PUT', body: payload, ...(opts || {}) });
    },
    saveKey(payload, opts) {
        return request(`${base}/provider/${payload.providerId}`, { method: 'PUT', body: payload, ...(opts || {}), });
    },
    // opsional, kalau endpoint upload ada:

};
