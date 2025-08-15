import { request } from './http';

const base = '/api/agent';

export const abApi = {
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
        return request(base, {
            method: "POST", body: payload, ...(opts || {}),
        })
    }

}