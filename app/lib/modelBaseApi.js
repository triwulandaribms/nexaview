// lib/knowledgeBaseApi.js
import { request } from './http';

const base = '/api/model';

export const mbApi = {
    list(opts) {
        return request(`${base}`, { method: 'GET', cache: 'no-store', ...(opts || {}) });
    },
    detail(id, opts) {
        return request(`${base}/${id}`, { method: 'GET', cache: 'no-store', ...(opts || {}) });
    },
    update(id, payload, opts) {
        return request(`${base}/${id}`, { method: 'PUT', body: payload, ...(opts || {}) });
    },
    remove(id, opts) {
        return request(`${base}/${id}`, { method: 'DELETE', ...(opts || {}) });
    },
    create(payload, opts) {
        return request(`${base}`, { method: 'POST', body: payload, ...(opts || {}) });
    },
    // opsional, kalau endpoint upload ada:

};
