import axios from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

let getToken = () => Cookies.get('token');

let getRefreshToken = () => Cookies.get('refreshToken');

export function setTokenGetter(fn) {
    getToken = fn;
}

export function setRefreshTokenGetter(fn) {
    getRefreshToken = fn;
}

async function request(url, params = {}, method = 'GET', body = null, onSuccess, onError) {
    try {
        console.log(`Requesting ${method} ${API_URL}/${url} with params:`, params);

        const token = getToken();
        const isFormData = body instanceof FormData;

        const config = {
            method,
            url: `${API_URL}/${url}`,
            headers: {
                Authorization: `Bearer ${token}`,
                ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            },
            params
        };

        if (method !== 'GET' && method !== 'DELETE' && body) {
            config.data = isFormData ? body : JSON.stringify(body);
        }

        console.log(`Making ${method} request to ${API_URL}/${url}`);
        console.log("Request Config:", config);

        const response = await axios(config);
        const data = response.data;

        if (onSuccess) onSuccess(data);
        return data;

    } catch (error) {
        // בדיקה אם הטוקן פג תוקף
        if (error.response?.status === 403 && !params._retry) {
            try {
                console.warn('Token expired, trying to refresh...');
                params._retry = true; // מניעת לולאה אינסופית

                const refreshToken = getRefreshToken();

                // בקשה ל-refresh token
                const refreshResponse = await axios.post(`${API_URL}/api/refresh-token`, { refreshToken });
                const newAccessToken = refreshResponse.data.accessToken;

                // שמירה של הטוקן החדש
                Cookies.set('token', newAccessToken);

                // ניסיון חוזר עם הטוקן החדש
                return await request(url, params, method, body, onSuccess, onError);

            } catch (refreshError) {
                console.error('Refresh token failed:', refreshError);
                // כאן אפשר לבצע לוגאאוט אם את רוצה
                // logOutFunc();
            }
        }

        if (error.response?.status === 403) {
            // כאן אפשר לבצע לוגאאוט אם את רוצה
            // logOutFunc();
        }

        console.error("API Error:", error);
        if (onError) onError(error.message || error.toString());
    }
}

export const apiService = {
    getAll: (table, onSuccess, onError) =>
        request(table, {}, 'GET', null, onSuccess, onError),

    get: (table, onSuccess, onError) =>
        request(table, {}, 'GET', null, onSuccess, onError),

    getByValue: (table, params, onSuccess, onError) =>
        request(table, params, 'GET', null, onSuccess, onError),

    getSearch: (table, params, onSuccess, onError) =>
        request(`${table}/search`, params, 'GET', null, onSuccess, onError),

    getCheck: (table, params, onSuccess, onError) =>
        request(`${table}/check`, params, 'GET', null, onSuccess, onError),

    getById: (table, onSuccess, onError) =>
        request(`${table}`, {}, 'GET', null, onSuccess, onError),

    getNested: (base, id, nested, params, onSuccess, onError) =>
        request(`${base}/${id}/${nested}`, params, 'GET', null, onSuccess, onError),

    create: (table, body, onSuccess, onError) =>
        request(table, {}, 'POST', body, onSuccess, onError),

    update: (table, id, data, onSuccess, onError) =>
        request(`${table}/${id}`, {}, 'PUT', data, onSuccess, onError),

    updateMany: (table, data, onSuccess, onError) =>
        request(`${table}`, {}, 'PUT', data, onSuccess, onError),

    patch: (table, id, data, onSuccess, onError) =>
        request(`${table}/${id}`, {}, 'PATCH', data, onSuccess, onError),

    remove: (table, id, onSuccess, onError) =>
        request(`${table}/${id}`, {}, 'DELETE', null, onSuccess, onError),
};