// src/routes/WorkOrderRoutes.tsx
import { Route } from "react-router-dom";
import CreateWorkOrder from "../pages/workOrder/Create";
import WorkOrderList from "../pages/workOrder/List";
import WorkOrderDetail from "../pages/workOrder/Detail";
import WorkOrderEdit from "../pages/workOrder/Edit";
import ProtectedRoute from "../components/ProtectedRoute";

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
    key="work-order-edit"
    path="/work-order/edit/:id"
    element={
      <ProtectedRoute>
        <WorkOrderEdit />
      </ProtectedRoute>
    }
  />,
];

export default WorkOrderRoutes;
