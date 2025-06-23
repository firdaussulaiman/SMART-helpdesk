// src/components/AuthCallback.jsx
import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function AuthCallback() {
  const { handleMsalCallback } = useAuth();
  const { search } = useLocation();
  const navigate = useNavigate();
  const doneRef = useRef(false);

  useEffect(() => {
    if (doneRef.current) return;
    doneRef.current = true;

    const params = new URLSearchParams(search);
    const code = params.get('code');
    if (!code) {
      navigate('/login', { replace: true });
      return;
    }

    handleMsalCallback(code).finally(() => {
      window.history.replaceState({}, '', window.location.pathname);
      navigate('/', { replace: true });
    });
  }, [search, navigate, handleMsalCallback]);

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <p>Authenticating with Microsoft…</p>
    </div>
  );
}
