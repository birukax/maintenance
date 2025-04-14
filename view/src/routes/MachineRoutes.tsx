// src/routes/MachineRoutes.tsx
import { Route } from 'react-router-dom';
import CreateMachine from '../pages/machine/Create';
import MachineList from '../pages/machine/List';
import MachineDetail from '../pages/machine/Detail';
import MachineEdit from '../pages/machine/Edit';
import ProtectedRoute from '../components/ProtectedRoute';

const MachineRoutes = [
  <Route
    key="machine-list"
    path="/machines"
    element={
      <ProtectedRoute>
        <MachineList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="machine-create"
    path="/machine/create"
    element={
      <ProtectedRoute>
        <CreateMachine />
      </ProtectedRoute>
    }
  />,
  <Route
    key="machine-detail"
    path="/machine/detail/:id"
    element={
      <ProtectedRoute>
        <MachineDetail />
      </ProtectedRoute>
    }
  />,
  <Route
    key="machine-edit"
    path="/machine/edit/:id"
    element={
      <ProtectedRoute>
        <MachineEdit />
      </ProtectedRoute>
    }
  />,
];

export default MachineRoutes;