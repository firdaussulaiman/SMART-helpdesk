// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const navigate = useNavigate();

  // 1) Start login by going to Azure
  function login() {
    window.location.href = process.env.REACT_APP_LOGIN_URI;
  }

  // 2) After Azure calls us back, exchange code → JWT
  async function handleMsalCallback(code) {
    const { data } = await api.post('/auth/login', {
      code,
      redirectUri: process.env.REACT_APP_REDIRECT_URI
    });
    setAccessToken(data.accessToken);
    // send on every future request
    api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
    navigate('/');
  }

  // 3) If we ever clear the token (e.g. page reload), remove header
  useEffect(() => {
    if (!accessToken) {
      delete api.defaults.headers.common.Authorization;
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ accessToken, login, handleMsalCallback }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
