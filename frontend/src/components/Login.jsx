// src/components/Login.jsx
import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" gutterBottom>
        SmartHelp Desk
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Please sign in to continue
      </Typography>
      <Button variant="contained" size="large" onClick={login}>
        ▶️ Sign in with Microsoft
      </Button>
    </Container>
  );
}
