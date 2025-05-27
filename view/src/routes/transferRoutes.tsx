// src/routes/TransferRoutes.tsx
import { Route } from "react-router-dom";
import CreateTransfer from "../pages/transfer/Create";
import TransferList from "../pages/transfer/List";
import TransferDetail from "../pages/transfer/Detail";
// import TransferEdit from "../pages/transfer/Edit";
import ProtectedRoute from "../components/ProtectedRoute";

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
  // <Route
  //   key="transfer-edit"
  //   path="/transfer/edit/:id"
  //   element={
  //     <ProtectedRoute>
  //       <TransferEdit />
  //     </ProtectedRoute>
  //   }
  // />,
];

export default TransferRoutes;
