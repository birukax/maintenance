// src/routes/ShelfRowRoutes.tsx
import { Route } from "react-router-dom";
import CreateShelfRow from "../pages/shelfRow/Create";
import ShelfRowList from "../pages/shelfRow/List";
import ShelfRowDetail from "../pages/shelfRow/Detail";
import ShelfRowEdit from "../pages/shelfRow/Edit";
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
