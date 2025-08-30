
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../store/store";
import AppLayout from "./AppLayout";
import { FC, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const tokens = useSelector((state: AppState) => state.auth.tokens);
  return tokens ? (
    <AppLayout>{children}</AppLayout>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
