// lib/knowledgeBaseApi.js
import { request } from './http';

const base = '/api/dataset';

export const dsApi = {
    list(opts) {
        return request(`${base}`, { method: 'GET', cache: 'no-store', ...(opts || {}) });
    },
    upload(file, { categories = [], tags = [] } = {}, opts) {
        const form = new FormData();
        form.append('file', file);
        form.append('categories', JSON.stringify(categories));
        form.append('tags', JSON.stringify(tags));
        return request(base, { method: 'POST', body: form, ...(opts || {}) });
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
