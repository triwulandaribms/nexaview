import { request } from './http';

const base = '/api/menus';

export const menusbApi = {
    list(opts) {
        return request(`${base}`, { method: 'GET', cache: 'no-store', ...(opts || {}) });
    },
    getSidebarMenu(opts) {
        return request(`${base}/all`, { method: 'GET', cache: 'no-store', ...(opts || {}) });
    }

}
