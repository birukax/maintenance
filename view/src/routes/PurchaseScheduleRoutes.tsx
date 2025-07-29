// src/routes/PurchaseScheduleRoutes.tsx
import { Route } from "react-router-dom";
import CreatePurchaseSchedule from "../pages/purchase/schedule/Create";
import PurchaseScheduleList from "../pages/purchase/schedule/List";
import PurchaseScheduleEdit from "../pages/purchase/schedule/Edit";
import ProtectedRoute from "../components/ProtectedRoute";

const PurchaseScheduleRoutes = [
  <Route
    key="purchase-schedule-list"
    path="/purchase-schedules"
    element={
      <ProtectedRoute>
        <PurchaseScheduleList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="purchase-schedule-create"
    path="/purchase-schedule/create"
    element={
      <ProtectedRoute>
        <CreatePurchaseSchedule />
      </ProtectedRoute>
    }
  />,
  <Route
    key="purchase-schedule-edit"
    path="/purchase-schedule/edit/:year"
    element={
      <ProtectedRoute>
        <PurchaseScheduleEdit />
      </ProtectedRoute>
    }
  />,
];

export default PurchaseScheduleRoutes;
