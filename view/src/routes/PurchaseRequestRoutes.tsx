// src/routes/PurchaseRequestRoutes.tsx
import { Route } from "react-router-dom";
import CreatePurchaseRequest from "../pages/purchase/request/Create";
import PurchaseRequestList from "../pages/purchase/request/List";
import PurchaseRequestReceiveList from '../pages/purchase/request/receive/List';
import PurchaseRequestDetail from "../pages/purchase/request/Detail";
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
    key='purchase-request-receive'
    path='/purchase-request/:id/receive'
    element={
      <ProtectedRoute>
        <PurchaseRequestReceiveList />
      </ProtectedRoute>
    }
  />
  ,

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
