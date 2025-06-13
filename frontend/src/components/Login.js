// src/components/Login.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();
  return (
    <div style={{ padding: 20 }}>
      <button onClick={login}>
        ▶️ Sign in with Microsoft
      </button>
    </div>
  );
}
