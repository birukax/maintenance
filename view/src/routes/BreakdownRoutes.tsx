// src/routes/BreakdownRoutes.tsx
import { Route } from "react-router-dom";
import CreateBreakdown from "../pages/breakdown/Create";
import BreakdownList from "../pages/breakdown/List";
import BreakdownDetail from "../pages/breakdown/Detail";
import BreakdownEdit from "../pages/breakdown/Edit";
import ProtectedRoute from "../components/ProtectedRoute";

const BreakdownRoutes = [
  <Route
    key="breakdown-list"
    path="/breakdowns"
    element={
      <ProtectedRoute>
        <BreakdownList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="breakdown-create"
    path="/breakdown/create"
    element={
      <ProtectedRoute>
        <CreateBreakdown />
      </ProtectedRoute>
    }
  />,
  <Route
    key="breakdown-detail"
    path="/breakdown/detail/:id"
    element={
      <ProtectedRoute>
        <BreakdownDetail />
      </ProtectedRoute>
    }
  />,
  <Route
    key="breakdown-edit"
    path="/breakdown/edit/:id"
    element={
      <ProtectedRoute>
        <BreakdownEdit />
      </ProtectedRoute>
    }
  />,
];

export default BreakdownRoutes;
