import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { Typography, Container, Button } from "@mui/material";

import api from "../utils/api";

const Dashboard = () => {
  const { tokens } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!tokens) {
    return <Typography>Please log in to view the dashboard.</Typography>;
  }
  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
