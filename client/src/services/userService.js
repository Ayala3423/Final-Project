import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const registerAuth = async (endpoint, body, onSuccess, onError) => {
  try {
    console.log("user: ", body.get ? body.get("username") : body.username);

    const isFormData = body instanceof FormData;

    const { data } = await axios.post(`${API_URL}/users/${endpoint}`, body, {
      headers: isFormData ? {} : { 'Content-Type': 'application/json' }
    });

    if (endpoint === "login") {
      if (data.accessToken) {
        Cookies.set('token', data.accessToken);
      }
      if (data.refreshToken) {
        Cookies.set('refreshToken', data.refreshToken);
      }
    }

    if (onSuccess) onSuccess(data);
    return data;
  } catch (error) {
    console.error(error);
    if (onError) {
      const message =
        error.response?.data?.message || error.message || "Unknown error";
      onError(message);
    }
  }
};

export const signup = (body, onSuccess, onError) =>
  registerAuth("signup", body, onSuccess, onError);

export const login = (body, onSuccess, onError) =>
  registerAuth("login", body, onSuccess, onError);