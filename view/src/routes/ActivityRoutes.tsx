// src/routes/ActivityRoutes.tsx
import { Route } from "react-router-dom";
import CreateActivity from "../pages/activity/Create";
import ActivityList from "../pages/activity/List";
import ActivityDetail from "../pages/activity/Detail";
import ActivityEdit from "../pages/activity/Edit";
import ProtectedRoute from "../components/ProtectedRoute";

const ActivityRoutes = [
  <Route
    key="activity-list"
    path="/activities"
    element={
      <ProtectedRoute>
        <ActivityList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="activity-create"
    path="/activity/create"
    element={
      <ProtectedRoute>
        <CreateActivity />
      </ProtectedRoute>
    }
  />,
  
  <Route
    key="activity-detail"
    path="/activity/detail/:id"
    element={
      <ProtectedRoute>
        <ActivityDetail />
      </ProtectedRoute>
    }
  />,
  <Route
    key="activity-edit"
    path="/activity/edit/:id"
    element={
      <ProtectedRoute>
        <ActivityEdit />
      </ProtectedRoute>
    }
  />,
];

export default ActivityRoutes;
