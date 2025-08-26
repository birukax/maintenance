// src/routes/ConsumptionRoutes.tsx
import { Route } from 'react-router-dom';
import CreateConsumption from '../pages/consumption/Create';
import ConsumptionList from '../pages/consumption/List';
import ConsumptionDetail from '../pages/consumption/Detail';
import ProtectedRoute from '../components/ProtectedRoute';

const ConsumptionRoutes = [
  <Route
    key="consumption-list"
    path="/consumptions"
    element={
      <ProtectedRoute>
        <ConsumptionList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="consumption-create"
    path="/consumption/create"
    element={
      <ProtectedRoute>
        <CreateConsumption />
      </ProtectedRoute>
    }
  />,
  <Route
    key="consumption-detail"
    path="/consumption/detail/:id"
    element={
      <ProtectedRoute>
        <ConsumptionDetail />
      </ProtectedRoute>
    }
  />,
];

export default ConsumptionRoutes;