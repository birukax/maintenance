// src/routes/PlantRoutes.tsx
import { Route } from "react-router-dom";
import CreatePlant from "../pages/plant/Create";
import PlantList from "../pages/plant/List";
import PlantDetail from "../pages/plant/Detail";
import PlantEdit from "../pages/plant/Edit";
import ProtectedRoute from "../components/ProtectedRoute";

const PlantRoutes = [
  <Route
    key="plant-list"
    path="/plants"
    element={
      <ProtectedRoute>
        <PlantList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="plant-create"
    path="/plant/create"
    element={
      <ProtectedRoute>
        <CreatePlant />
      </ProtectedRoute>
    }
  />,
  <Route
    key="plant-detail"
    path="/plant/detail/:id"
    element={
      <ProtectedRoute>
        <PlantDetail />
      </ProtectedRoute>
    }
  />,
  <Route
    key="plant-edit"
    path="/plant/edit/:id"
    element={
      <ProtectedRoute>
        <PlantEdit />
      </ProtectedRoute>
    }
  />,
];

export default PlantRoutes;
