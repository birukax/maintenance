// src/routes/ShelfRoutes.tsx
import { Route } from "react-router-dom";
import CreateShelf from "../pages/shelf/Create";
import ShelfList from "../pages/shelf/List";
import ShelfDetail from "../pages/shelf/Detail";
import ShelfEdit from "../pages/shelf/Edit";
import ProtectedRoute from "../components/ProtectedRoute";

const ShelfRoutes = [
  <Route
    key="shelf-list"
    path="/shelves"
    element={
      <ProtectedRoute>
        <ShelfList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="shelf-create"
    path="/shelf/create"
    element={
      <ProtectedRoute>
        <CreateShelf />
      </ProtectedRoute>
    }
  />,
  <Route
    key="shelf-detail"
    path="/shelf/detail/:id"
    element={
      <ProtectedRoute>
        <ShelfDetail />
      </ProtectedRoute>
    }
  />,
  <Route
    key="shelf-edit"
    path="/shelf/edit/:id"
    element={
      <ProtectedRoute>
        <ShelfEdit />
      </ProtectedRoute>
    }
  />,
];

export default ShelfRoutes;
