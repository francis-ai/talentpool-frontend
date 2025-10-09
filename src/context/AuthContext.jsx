import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || null);

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Logout function
  const logout = useCallback(async () => {
    try {
      await axios.post(`${BASE_URL}/api/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("accessToken");
    }
  }, [BASE_URL]); // ✅ only BASE_URL as dependency

  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/refresh-token`, {}, { withCredentials: true });
      if (res.data?.token) {
        setAccessToken(res.data.token);
        localStorage.setItem("accessToken", res.data.token);
        return res.data.token;
      }
      await logout();
      return null;
    } catch (err) {
      console.error("Refresh token failed:", err);
      await logout();
      return null;
    }
  }, [BASE_URL, logout]); // add logout as dependency

  
  // Axios instance
  const axiosInstance = useMemo(() => {
    const instance = axios.create({ baseURL: `${BASE_URL}/api`, withCredentials: true });

    instance.interceptors.request.use((config) => {
      if (accessToken) config.headers["Authorization"] = `Bearer ${accessToken}`;
      return config;
    });

    instance.interceptors.response.use(
      (res) => res,
      async (error) => {
        if (error.response?.status === 401) {
          const newToken = await refreshToken();
          if (newToken) {
            error.config.headers["Authorization"] = `Bearer ${newToken}`;
            return instance(error.config);
          }
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [accessToken, refreshToken, BASE_URL]);

  // Load user profile
  const loadProfile = useCallback(async (token) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axiosInstance.get("/profile", { headers });
      setUser(res.data);
    } catch (err) {
      console.error("Load profile failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [axiosInstance]);

  // Login function
  const login = useCallback(async (email, password) => {
    try {
      const res = await axiosInstance.post("/login", { email, password });
      if (res.data?.token) {
        setAccessToken(res.data.token);
        localStorage.setItem("accessToken", res.data.token);
        await loadProfile(res.data.token);
      }
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  }, [axiosInstance, loadProfile]);

  // Initial load
  useEffect(() => {
    (async () => {
      const token = accessToken || (await refreshToken());
      if (token) await loadProfile(token);
      else setLoading(false);
    })();
  }, [accessToken, refreshToken, loadProfile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
        axiosInstance,
        token: accessToken,   // ✅ add this line
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
