const API_URL = "http://localhost:3000/user";

const registerAuth = async (endpoint, body, onSuccess, onError) => {
    try {
        console.log("user: ", body.username, body.password);
        const response = await fetch(
            `${API_URL}/${endpoint}`,{

          method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
        
        const data = await response.json();
        if (onSuccess) onSuccess(data);
        return data;
    } catch (error) {
        console.error(error);
        if (onError) onError(error.message);
    }
};

export const signup = (body, onSuccess, onError) => registerAuth("signup", body, onSuccess, onError);
export const login = (body, onSuccess, onError) => registerAuth("login", body, onSuccess, onError);