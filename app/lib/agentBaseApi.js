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
    },
    detailListSession(id, opts) {
        return request(`${base}/${id}/sessions`, { method: 'GET', cache: 'no-store', ...(opts || {}) });
    },
    deleteSession(id, id_session, opts) {
        return request(`${base}/${id}/sessions/${id_session}`, { method: 'DELETE', ...(opts || {}) });
    },
    detailListSessionMessages(id, id_session, opts) {
        return request(`${base}/${id}/sessions/${id_session}/messages`, { method: 'GET', cache: 'no-store', ...(opts || {}) });
    },
    detailListAddMessages(id, payload, opts) {
        return request(`${base}/${id}/sessions/messages`, { method: 'POST', body: payload, cache: 'no-store', ...(opts || {}) });
    },
}