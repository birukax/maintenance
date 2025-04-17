// src/routes/ScheduleRoutes.tsx
import { Route } from "react-router-dom";
import CreateSchedule from "../pages/schedule/Create";
import ScheduleList from "../pages/schedule/List";
import ScheduleDetail from "../pages/schedule/Detail";
import ScheduleEdit from "../pages/schedule/Edit";
import ProtectedRoute from "../components/ProtectedRoute";

const ScheduleRoutes = [
  <Route
    key="schedule-list"
    path="/schedules"
    element={
      <ProtectedRoute>
        <ScheduleList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="schedule-create"
    path="/schedule/create"
    element={
      <ProtectedRoute>
        <CreateSchedule />
      </ProtectedRoute>
    }
  />,
  <Route
    key="schedule-detail"
    path="/schedule/detail/:id"
    element={
      <ProtectedRoute>
        <ScheduleDetail />
      </ProtectedRoute>
    }
  />,
  <Route
    key="schedule-edit"
    path="/schedule/edit/:id"
    element={
      <ProtectedRoute>
        <ScheduleEdit />
      </ProtectedRoute>
    }
  />,
];

export default ScheduleRoutes;
