import axios from "axios";

const API_URL = "https://localhost:7039/api/auth";

export const register = async (userData) => {
  return axios.post(`${API_URL}/register`, userData, {
    withCredentials: true,
  });
};

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials, {
    withCredentials: true,
  });
  return response.data;
};

export const logout = async () => {
  return axios.post(`${API_URL}/logout`, {}, {
    withCredentials: true,
  });
};

export const profile = async () => {
  return axios.get(`${API_URL}/profile`, {
    withCredentials: true,
  });
};

export const checkAuth = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axios.get(`${API_URL}/profile`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};