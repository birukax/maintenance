// src/routes/WorkOrderRoutes.tsx
import { Route } from "react-router-dom";
import CreateWorkOrder from "../pages/workOrder/Create";
import WorkOrderList from "../pages/workOrder/List";
import WorkOrderDetail from "../pages/workOrder/Detail";
import ProtectedRoute from "../components/ProtectedRoute";
import CheckList from "../pages/workOrderActivity/CheckList";
const WorkOrderRoutes = [
  <Route
    key="work-order-list"
    path="/work-orders"
    element={
      <ProtectedRoute>
        <WorkOrderList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="work-order-create"
    path="/work-order/create"
    element={
      <ProtectedRoute>
        <CreateWorkOrder />
      </ProtectedRoute>
    }
  />,
  <Route
    key="work-order-detail"
    path="/work-order/detail/:id"
    element={
      <ProtectedRoute>
        <WorkOrderDetail />
      </ProtectedRoute>
    }
  />,
  <Route
    key="work-order-check-list"
    path="/work-order/check-list/:id"
    element={
      <ProtectedRoute>
        <CheckList />
      </ProtectedRoute>
    }
  />,
];

export default WorkOrderRoutes;
