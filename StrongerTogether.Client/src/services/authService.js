import axios from "axios";

const API_URL = import.meta.env.VITE_PUBLIC_API_URL;

export const register = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data || "Registration failed.";
  }
};

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials, {
    withCredentials: true,
  });
  return response.data;
};

export const logout = async () => {
  return axios.post(`${API_URL}/auth/logout`, {}, {
    withCredentials: true,
  });
};

export const profile = async () => {
  return axios.get(`${API_URL}/auth/profile`, {
    withCredentials: true,
  });
};

export const checkAuth = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axios.get(`${API_URL}/auth/profile`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};