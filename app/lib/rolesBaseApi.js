import { request } from './http';

const base = '/api/roles';

export const rbApi = {
    list(opts) {
        return request(`${base}`, { method: 'GET', cache: 'no-store', ...(opts || {}) });
    },
    detail(id, opts) {
        return request(`${base}/${id}`, { method: 'GET', cache: 'no-store', ...(opts || {}) });
    },
    update(id, payload, opts) {
        return request(`${base}/${id}`, { method: 'PUT', body: payload, ...(opts || {}) });
    },
    delete(id, opts) {
        return request(`${base}/${id}`, { method: 'DELETE', ...(opts || {}) });
    },
    create(payload, opts) {
        return request(base, {
            method: "POST", body: payload, ...(opts || {}),
        })
    }

}