// src/routes/ReturnRoutes.tsx
import { Route } from 'react-router-dom';
import CreateReturn from '../pages/return/Create';
import ReturnList from '../pages/return/List';
import ReturnDetail from '../pages/return/Detail';
import ReturnEdit from '../pages/return/Edit';
import ProtectedRoute from '../components/ProtectedRoute';

const ReturnRoutes = [
  <Route
    key="return-list"
    path="/returns"
    element={
      <ProtectedRoute>
        <ReturnList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="return-create"
    path="/return/create"
    element={
      <ProtectedRoute>
        <CreateReturn />
      </ProtectedRoute>
    }
  />,
  <Route
    key="return-detail"
    path="/return/detail/:id"
    element={
      <ProtectedRoute>
        <ReturnDetail />
      </ProtectedRoute>
    }
  />,
  <Route
    key="return-edit"
    path="/return/edit/:id"
    element={
      <ProtectedRoute>
        <ReturnEdit />
      </ProtectedRoute>
    }
  />,
];

export default ReturnRoutes;