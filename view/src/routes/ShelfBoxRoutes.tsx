// src/routes/ShelfBoxRoutes.tsx
import { Route } from "react-router-dom";
import CreateShelfBox from "../pages/shelf/box/Create";
import ShelfBoxList from "../pages/shelf/box/List";
import ShelfBoxDetail from "../pages/shelf/box/Detail";
import ShelfBoxEdit from "../pages/shelf/box/Edit";
import ProtectedRoute from "../components/ProtectedRoute";

const ShelfBoxRoutes = [
  <Route
    key="shelfBox-list"
    path="/shelf-boxes"
    element={
      <ProtectedRoute>
        <ShelfBoxList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="shelfBox-create"
    path="/shelf-box/create"
    element={
      <ProtectedRoute>
        <CreateShelfBox />
      </ProtectedRoute>
    }
  />,
  <Route
    key="shelfBox-detail"
    path="/shelf-box/detail/:id"
    element={
      <ProtectedRoute>
        <ShelfBoxDetail />
      </ProtectedRoute>
    }
  />,
  <Route
    key="shelfBox-edit"
    path="/shelf-box/edit/:id"
    element={
      <ProtectedRoute>
        <ShelfBoxEdit />
      </ProtectedRoute>
    }
  />,
];

export default ShelfBoxRoutes;
