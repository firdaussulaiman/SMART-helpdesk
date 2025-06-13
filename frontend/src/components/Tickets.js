// src/components/Tickets.js
import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const { accessToken, login } = useAuth();

  useEffect(() => {
    if (!accessToken) {
      login();
      return;
    }
    api.get('/tickets')
      .then(res => setTickets(res.data))
      .catch(err => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          login();
        }
      });
  }, [accessToken, login]);

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
