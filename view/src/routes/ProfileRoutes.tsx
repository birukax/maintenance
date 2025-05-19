// src/routes/UserRoutes.tsx
import { Route } from "react-router-dom";
import CreateUser from "../pages/users/Create";
import UserList from "../pages/users/List";
import UserDetail from "../pages/users/Detail";
import UserEdit from "../pages/users/Edit";
import ProfileDetail from "../pages/profile/Detail";
import ProfileEdit from "../pages/profile/Edit";
import ProtectedRoute from "../components/ProtectedRoute";

const UserRoutes = [
  <Route
    key="user-list"
    path="/users"
    element={
      <ProtectedRoute>
        <UserList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="user-create"
    path="/user/create"
    element={
      <ProtectedRoute>
        <CreateUser />
      </ProtectedRoute>
    }
  />,
  <Route
    key="user-detail"
    path="/user/detail/:id"
    element={
      <ProtectedRoute>
        <UserDetail />
      </ProtectedRoute>
    }
  />,
  <Route
    key="profile-detail"
    path="/profile/:id"
    element={
      <ProtectedRoute>
        <ProfileDetail />
      </ProtectedRoute>
    }
  />,
  <Route
    key="profile-edit"
    path="/profile/passwordreset/:id"
    element={
      <ProtectedRoute>
        <ProfileEdit />
      </ProtectedRoute>
    }
  />,
];

export default UserRoutes;
