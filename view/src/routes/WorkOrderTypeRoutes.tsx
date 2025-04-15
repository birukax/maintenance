// src/routes/WorkOrderTypeRoutes.tsx
import { Route } from "react-router-dom";
import CreateWorkOrderType from "../pages/workOrderType/Create";
import WorkOrderTypeList from "../pages/workOrderType/List";
import WorkOrderTypeDetail from "../pages/workOrderType/Detail";
import WorkOrderTypeEdit from "../pages/workOrderType/Edit";
import ProtectedRoute from "../components/ProtectedRoute";

const WorkOrderTypeRoutes = [
  <Route
    key="work-order-type-list"
    path="/work-order-types"
    element={
      <ProtectedRoute>
        <WorkOrderTypeList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="work-order-type-create"
    path="/work-order-type/create"
    element={
      <ProtectedRoute>
        <CreateWorkOrderType />
      </ProtectedRoute>
    }
  />,
  <Route
    key="work-order-type-detail"
    path="/work-order-type/detail/:id"
    element={
      <ProtectedRoute>
        <WorkOrderTypeDetail />
      </ProtectedRoute>
    }
  />,
  <Route
    key="work-order-type-edit"
    path="/work-order-type/edit/:id"
    element={
      <ProtectedRoute>
        <WorkOrderTypeEdit />
      </ProtectedRoute>
    }
  />,
];

export default WorkOrderTypeRoutes;
