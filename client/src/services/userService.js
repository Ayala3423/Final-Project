import axios from 'axios';

const API_URL = "http://localhost:3000/user";

const registerAuth = async (endpoint, body, onSuccess, onError) => {
  try {
    console.log("user: ", body.username, body.password);

    const { data } = await axios.post(`${API_URL}/${endpoint}`, body);

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