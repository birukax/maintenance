import React, { useState} from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setTokens } from '../store/slices/authSlice';
import api from '../utils/api';
import { Button, TextField, Typography, Container, CircularProgress} from '@mui/material';

const Login = () => {
    const [username, setUsername] =  useState<string>('');
    const [password, setPassword] =  useState<string>('');
    const [error, setError] =  useState<string>('');
    const [loading, setLoading] =  useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async(e) => {
        e.preventDefault();
        setLoading(true);
        try{
            const response = await api.post('/api/token/', {username, password });
            dispatch(setTokens(response.data));
            setError('');
            navigate('/dashboard/');
        }catch(err: any) {
            setError(err.response?.data?.detail || 'Login Failed');
        }finally {
            setLoading(false);
        }
    }
    return (
        <Container className="flex flex-col items-center justify-center min-h-screen">
          <Typography variant="h4" className="mb-6 text-gray-800">
            Login
          </Typography>
          <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              className="mt-4"
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </form>
          {error && (
            <Typography variant="body2" className="mt-4 text-red-500">
              {error}
            </Typography>
          )}
        </Container>
      );
    };
    
    export default Login;
