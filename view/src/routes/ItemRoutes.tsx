// src/routes/ItemRoutes.tsx
import { Route } from "react-router-dom";
import ItemList from "../pages/item/List";
import ItemDetail from "../pages/item/Detail";
import CreateItem from "../pages/item/Create";
import ItemEdit from "../pages/item/Edit";
import ProtectedRoute from "../components/ProtectedRoute";

const ItemRoutes = [
  <Route
    key="item-list"
    path="/items"
    element={
      <ProtectedRoute>
        <ItemList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="item-create"
    path="/item/create"
    element={
      <ProtectedRoute>
        <CreateItem />
      </ProtectedRoute>
    }
  />,
  <Route
    key="item-detail"
    path="/item/detail/:id"
    element={
      <ProtectedRoute>
        <ItemDetail />
      </ProtectedRoute>
    }
  />,
  <Route
    key="item-edit"
    path="/item/edit/:id"
    element={
      <ProtectedRoute>
        <ItemEdit />
      </ProtectedRoute>
    }
  />,
];

export default ItemRoutes;
