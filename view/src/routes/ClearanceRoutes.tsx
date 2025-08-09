// src/routes/ClearanceRoutes.tsx
import { Route } from "react-router-dom";
import CreateClearance from "../pages/clearance/Create";
import ClearanceList from "../pages/clearance/List";
import ClearanceDetail from "../pages/clearance/Detail";
import ClearanceEdit from "../pages/clearance/Edit";
import ProtectedRoute from "../components/ProtectedRoute";

const ClearanceRoutes = [
  <Route
    key="clearance-list"
    path="/clearances"
    element={
      <ProtectedRoute>
        <ClearanceList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="clearance-create"
    path="/clearance/create"
    element={
      <ProtectedRoute>
        <CreateClearance />
      </ProtectedRoute>
    }
  />,
  <Route
    key="clearance-detail"
    path="/clearance/detail/:id"
    element={
      <ProtectedRoute>
        <ClearanceDetail />
      </ProtectedRoute>
    }
  />,
  <Route
    key="clearance-edit"
    path="/clearance/edit/:id"
    element={
      <ProtectedRoute>
        <ClearanceEdit />
      </ProtectedRoute>
    }
  />,
];

export default ClearanceRoutes;
