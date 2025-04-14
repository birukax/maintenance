// src/routes/OtherRoutes.tsx
import { Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import InventoryList from '../pages/inventory/List';
import PurchaseApprovalList from '../pages/approval/purchase/List';
import ProtectedRoute from '../components/ProtectedRoute';

const OtherRoutes = [
  <Route
    key="dashboard"
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />,
  <Route
    key="inventory-list"
    path="/inventories"
    element={
      <ProtectedRoute>
        <InventoryList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="purchase-approval-list"
    path="/purchase-approvals"
    element={
      <ProtectedRoute>
        <PurchaseApprovalList />
      </ProtectedRoute>
    }
  />,
];

export default OtherRoutes;