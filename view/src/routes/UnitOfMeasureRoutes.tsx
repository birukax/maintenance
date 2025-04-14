// src/routes/UnitOfMeasureRoutes.tsx
import { Route } from "react-router-dom";
import CreateUnitOfMeasure from "../pages/unitOfMeasure/Create";
import UnitOfMeasureList from "../pages/unitOfMeasure/List";
import UnitOfMeasureDetail from "../pages/unitOfMeasure/Detail";
import UnitOfMeasureEdit from "../pages/unitOfMeasure/Edit";
import ProtectedRoute from "../components/ProtectedRoute";

const UnitOfMeasureRoutes = [
  <Route
    key="unit-of-measure-list"
    path="/unit-of-measures"
    element={
      <ProtectedRoute>
        <UnitOfMeasureList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="unit-of-measure-create"
    path="/unit-of-measure/create"
    element={
      <ProtectedRoute>
        <CreateUnitOfMeasure />
      </ProtectedRoute>
    }
  />,
  <Route
    key="unit-of-measure-detail"
    path="/unit-of-measure/detail/:id"
    element={
      <ProtectedRoute>
        <UnitOfMeasureDetail />
      </ProtectedRoute>
    }
  />,
  <Route
    key="unit-of-measure-edit"
    path="/unit-of-measure/edit/:id"
    element={
      <ProtectedRoute>
        <UnitOfMeasureEdit />
      </ProtectedRoute>
    }
  />,
];

export default UnitOfMeasureRoutes;
