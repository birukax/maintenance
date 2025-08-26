import { useEffect, useState, FormEvent } from 'react';
import { AppState, AppDispatch } from "../store/store";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setTokens } from '../store/slices/authSlice';
import api from '../utils/api';
import { Button, TextField, Typography, Container, CircularProgress } from '@mui/material';

const Login = () => {
  const tokens = useSelector((state: AppState) => state.auth.tokens);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const previousRoute: string | null = sessionStorage.getItem("previousRoute")
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/api/token/', { username, password });
      dispatch(setTokens(response.data));
      setError('');
      if (previousRoute) {
        navigate(previousRoute);
      } else {
        navigate("/dashboard/");
      }
    } catch (error: any) {
      setError(error?.response?.data?.detail || 'Login Failed');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (tokens) {
      if (previousRoute) {
        navigate(previousRoute);
      } else {
        navigate("/dashboard/");
      }
    }
  }, [])

  return (
    <Container className="flex flex-col items-center justify-center min-h-screen">
      <Typography variant="h4" color='primary' className="mb-6! ">
        WELCOME
      </Typography>
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <div className='flex-col'>
          <TextField
            size='small'
            className='mb-2!'
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <TextField
            size='small'
            className='mb-2!'
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <Button
          size='small'
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Log in'}
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
