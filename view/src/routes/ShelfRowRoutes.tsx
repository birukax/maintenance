// src/routes/ShelfRowRoutes.tsx
import { Route } from "react-router-dom";
import CreateShelfRow from "../pages/shelf/row/Create";
import ShelfRowList from "../pages/shelf/row/List";
import ShelfRowDetail from "../pages/shelf/row/Detail";
import ShelfRowEdit from "../pages/shelf/row/Edit";
import ProtectedRoute from "../components/ProtectedRoute";

const ShelfRowRoutes = [
  <Route
    key="shelfRow-list"
    path="/shelf-rows"
    element={
      <ProtectedRoute>
        <ShelfRowList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="shelfRow-create"
    path="/shelf-row/create"
    element={
      <ProtectedRoute>
        <CreateShelfRow />
      </ProtectedRoute>
    }
  />,
  <Route
    key="shelfRow-detail"
    path="/shelf-row/detail/:id"
    element={
      <ProtectedRoute>
        <ShelfRowDetail />
      </ProtectedRoute>
    }
  />,
  <Route
    key="shelfRow-edit"
    path="/shelf-row/edit/:id"
    element={
      <ProtectedRoute>
        <ShelfRowEdit />
      </ProtectedRoute>
    }
  />,
];

export default ShelfRowRoutes;
