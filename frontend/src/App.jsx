// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import AuthCallback from './components/AuthCallback.jsx';
import Tickets from './components/Tickets.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/" element={<Tickets />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
