import Cookies from "js-cookie";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
import { logOutFunc } from "../src/js/logout.js"
let getToken = () => Cookies.get('token');

export function setTokenGetter(fn) {
    getToken = fn;
}

async function request(userId, url, params = {}, method = 'GET', body = null, onSuccess, onError) {
    try {
        const token = getToken();
        const config = {
            method,
            url: `${API_URL}/users/${userId}/${url}`,
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            params
        };
        if (method !== 'DELETE' && body) {
            config.data = body;
        }
        const response = await fetch(config);
        const data = response.data;
        if (onSuccess) {
            onSuccess(data)
        };
        return data;
    } catch (error) {
        if (error.response?.status == 403) {
            logOutFunc();
        }
        console.error(error);
        if (onError) onError(error.message);
    }
}

export const apiService = {
    getAll: (userId, table, onSuccess, onError) =>
        request(userId, table, {}, 'GET', null, onSuccess, onError),
    getByValue: (userId, table, params, onSuccess, onError) =>
        request(userId, table, params, 'GET', null, onSuccess, onError),
    getById: (userId, table, onSuccess, onError) =>
        request(userId, `${table}`, {}, 'GET', null, onSuccess, onError),
    getNested: (userId, base, id, nested, params, onSuccess, onError) =>
        request(userId, `${base}/${id}/${nested}`, params, 'GET', null, onSuccess, onError),
    create: (userId, table, body, onSuccess, onError) =>
        request(userId, table, {}, 'POST', body, onSuccess, onError),
    update: (userId, table, id, data, onSuccess, onError) =>
        request(userId, `${table}/${id}`, {}, 'PUT', data, onSuccess, onError),
    patch: (userId, table, id, data, onSuccess, onError) =>
        request(userId, `${table}/${id}`, {}, 'PATCH', data, onSuccess, onError),
    remove: (userId, table, id, onSuccess, onError) =>
        request(userId, `${table}/${id}`, {}, 'DELETE', null, onSuccess, onError),
};