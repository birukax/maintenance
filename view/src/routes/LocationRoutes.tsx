// src/routes/LocationRoutes.tsx
import { Route } from "react-router-dom";
import CreateLocation from "../pages/location/Create";
import LocationList from "../pages/location/List";
import LocationDetail from "../pages/location/Detail";
import LocationEdit from "../pages/location/Edit";
import ProtectedRoute from "../components/ProtectedRoute";

const LocationRoutes = [
  <Route
    key="location-list"
    path="/locations"
    element={
      <ProtectedRoute>
        <LocationList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="location-create"
    path="/location/create"
    element={
      <ProtectedRoute>
        <CreateLocation />
      </ProtectedRoute>
    }
  />,
  <Route
    key="location-detail"
    path="/location/detail/:id"
    element={
      <ProtectedRoute>
        <LocationDetail />
      </ProtectedRoute>
    }
  />,
  <Route
    key="location-edit"
    path="/location/edit/:id"
    element={
      <ProtectedRoute>
        <LocationEdit />
      </ProtectedRoute>
    }
  />,
];

export default LocationRoutes;
