// src/routes/ActivityTypeRoutes.tsx
import { Route } from "react-router-dom";
import CreateActivityType from "../pages/activityType/Create";
import ActivityTypeList from "../pages/activityType/List";
import ActivityTypeDetail from "../pages/activityType/Detail";
import ActivityTypeEdit from "../pages/activityType/Edit";
import ProtectedRoute from "../components/ProtectedRoute";

const ActivityTypeRoutes = [
  <Route
    key="activity-type-list"
    path="/activity-types"
    element={
      <ProtectedRoute>
        <ActivityTypeList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="activity-type-create"
    path="/activity-type/create"
    element={
      <ProtectedRoute>
        <CreateActivityType />
      </ProtectedRoute>
    }
  />,
  <Route
    key="activity-type-detail"
    path="/activity-type/detail/:id"
    element={
      <ProtectedRoute>
        <ActivityTypeDetail />
      </ProtectedRoute>
    }
  />,
  <Route
    key="activity-type-edit"
    path="/activity-type/edit/:id"
    element={
      <ProtectedRoute>
        <ActivityTypeEdit />
      </ProtectedRoute>
    }
  />,
];

export default ActivityTypeRoutes;
