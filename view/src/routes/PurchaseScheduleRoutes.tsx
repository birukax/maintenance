// src/routes/PurchaseScheduleRoutes.tsx
import { Route } from "react-router-dom";
import CreatePurchaseSchedule from "../pages/purchaseSchedule/Create";
import PurchaseScheduleList from "../pages/purchaseSchedule/List";
import PurchaseScheduleDetail from "../pages/purchaseSchedule/Detail";
import PurchaseScheduleEdit from "../pages/purchaseSchedule/Edit";
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
    key="purchase-schedule-detail"
    path="/purchase-schedule/detail/:id"
    element={
      <ProtectedRoute>
        <PurchaseScheduleDetail />
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
