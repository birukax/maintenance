import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ItemsPage from "./pages/ItemsPage";

const PrivateRoute = ({ children }) => {
  const { tokens } = useSelector((state) => state.auth);
  return tokens ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/items"
          element={
            <PrivateRoute>
              <ItemsPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
