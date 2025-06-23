// src/components/Tickets.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const { accessToken } = useAuth();

  // If no JWT, send user to our /login route
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    // Fetch tickets once we have a token
    api
      .get('/tickets')
      .then(res => setTickets(res.data))
      .catch(err => {
        const status = err.response?.status;
        if (status === 401 || status === 403) {
          // Token expired or invalid → force a fresh login
          window.location.href = import.meta.env.VITE_LOGIN_URI;
        }
      });
  }, [accessToken]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Your tickets</h1>
      <ul>
        {tickets.map(t => (
          <li key={t._id}>
            <strong>{t.title}</strong> — {t.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
// This component fetches and displays the user's tickets.
// If the user is not authenticated, it redirects them to the login page. 