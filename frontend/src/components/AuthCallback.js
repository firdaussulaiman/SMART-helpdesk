// src/components/AuthCallback.js
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AuthCallback() {
  const [qs] = useSearchParams();
  const { handleMsalCallback } = useAuth();

  useEffect(() => {
    const code = qs.get('code');
    if (code) {
      handleMsalCallback(code)
        .catch(console.error);
    }
  }, [qs, handleMsalCallback]);

  return <p>🕑 Logging you in…</p>;
}
