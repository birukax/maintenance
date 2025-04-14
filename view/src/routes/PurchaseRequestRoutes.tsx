// src/routes/PurchaseRequestRoutes.tsx
import { Route } from "react-router-dom";
import CreatePurchaseRequest from "../pages/purchaseRequest/Create";
import PurchaseRequestList from "../pages/purchaseRequest/List";
import PurchaseRequestDetail from "../pages/purchaseRequest/Detail";
import ProtectedRoute from "../components/ProtectedRoute";

const PurchaseRequestRoutes = [
  <Route
    key="purchase-request-list"
    path="/purchase-requests"
    element={
      <ProtectedRoute>
        <PurchaseRequestList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="purchase-request-create"
    path="/purchase-request/create"
    element={
      <ProtectedRoute>
        <CreatePurchaseRequest />
      </ProtectedRoute>
    }
  />,
  <Route
    key="purchase-request-detail"
    path="/purchase-request/detail/:id"
    element={
      <ProtectedRoute>
        <PurchaseRequestDetail />
      </ProtectedRoute>
    }
  />,
];

export default PurchaseRequestRoutes;
