import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTokens } from "../store/authSlice";
import { Button, TextField, Typography, Container } from "@mui/material";
import api from "../utils/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/token/", { username, password });
      dispatch(setTokens(response.data));
      setTokens({ access, refresh });
      setError("");
      navigate("/");
    } catch (err) {
      setError(err);
      //   setError(err.response?.data?.detail || "Login failed");
      //   setError("Invalid credentials");
    }
  };

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
          className="bg-white"
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-white"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className="mt-4"
        >
          Login
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
