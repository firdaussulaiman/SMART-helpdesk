// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);

  function login() {
    const params = new URLSearchParams({
      client_id:    import.meta.env.VITE_CLIENT_ID,
      response_type:'code',
      redirect_uri: import.meta.env.VITE_REDIRECT_URI,
      response_mode:'query',
      scope:        'openid profile email',
    });
    window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params}`;
  }

  async function handleMsalCallback(code) {
    try {
      const { data } = await api.post('/auth/login', {
        code,
        redirectUri: import.meta.env.VITE_REDIRECT_URI,
      });
      setAccessToken(data.accessToken);
      api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
    } catch (err) {
      if (err.response?.data.error !== 'invalid_grant') {
        console.error('OAuth login failed:', err.response.data || err);
      }
    }
  }

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
