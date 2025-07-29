// src/routes/TransferRoutes.tsx
import { Route } from "react-router-dom";
import CreateTransfer from "../pages/transfer/Create";
import TransferList from "../pages/transfer/List";
import TransferHistoryList from "../pages/transfer/history/List";
import TransferDetail from "../pages/transfer/Detail";
// import TransferEdit from "../pages/transfer/Edit";
import ProtectedRoute from "../components/ProtectedRoute";
import Receive from "../pages/transfer/Receive"
import ShipList from "../pages/transfer/ship/List";
const TransferRoutes = [
  <Route
    key="transfer-list"
    path="/transfers"
    element={
      <ProtectedRoute>
        <TransferList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="transfer-create"
    path="/transfer/create"
    element={
      <ProtectedRoute>
        <CreateTransfer />
      </ProtectedRoute>
    }
  />,
  <Route
    key="transfer-detail"
    path="/transfer/detail/:id"
    element={
      <ProtectedRoute>
        <TransferDetail />
      </ProtectedRoute>
    }
  />,
  <Route
    key="transfer-edit"
    path="/transfer/receive/:id"
    element={
      <ProtectedRoute>
        <Receive />
      </ProtectedRoute>
    }
  />,
  <Route
    key="transfer-ship"
    path="/transfer/:id/ship"
    element={
      <ProtectedRoute>
        <ShipList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="transfer-history"
    path="/transfer/history"
    element={
      <ProtectedRoute>
        <TransferHistoryList />
      </ProtectedRoute>
    }
  />,
];

export default TransferRoutes;
