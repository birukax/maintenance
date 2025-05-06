// src/routes/AreaRoutes.tsx
import { Route } from "react-router-dom";
import CreateArea from "../pages/area/Create";
import AreaList from "../pages/area/List";
import AreaDetail from "../pages/area/Detail";
import AreaEdit from "../pages/area/Edit";
import ProtectedRoute from "../components/ProtectedRoute";

const AreaRoutes = [
  <Route
    key="area-list"
    path="/areas"
    element={
      <ProtectedRoute>
        <AreaList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="area-create"
    path="/area/create"
    element={
      <ProtectedRoute>
        <CreateArea />
      </ProtectedRoute>
    }
  />,
  <Route
    key="area-detail"
    path="/area/detail/:id"
    element={
      <ProtectedRoute>
        <AreaDetail />
      </ProtectedRoute>
    }
  />,
  <Route
    key="area-edit"
    path="/area/edit/:id"
    element={
      <ProtectedRoute>
        <AreaEdit />
      </ProtectedRoute>
    }
  />,
];

export default AreaRoutes;
