// src/routes/EquipmentRoutes.tsx
import { Route } from 'react-router-dom';
import CreateEquipment from '../pages/equipment/Create';
import EquipmentList from '../pages/equipment/List';
import EquipmentDetail from '../pages/equipment/Detail';
import EquipmentEdit from '../pages/equipment/Edit';
import ProtectedRoute from '../components/ProtectedRoute';

const EquipmentRoutes = [
  <Route
    key="equipment-list"
    path="/equipments"
    element={
      <ProtectedRoute>
        <EquipmentList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="equipment-create"
    path="/equipment/create"
    element={
      <ProtectedRoute>
        <CreateEquipment />
      </ProtectedRoute>
    }
  />,
  <Route
    key="equipment-detail"
    path="/equipment/detail/:id"
    element={
      <ProtectedRoute>
        <EquipmentDetail />
      </ProtectedRoute>
    }
  />,
  <Route
    key="equipment-edit"
    path="/equipment/edit/:id"
    element={
      <ProtectedRoute>
        <EquipmentEdit />
      </ProtectedRoute>
    }
  />,
];

export default EquipmentRoutes;