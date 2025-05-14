// src/routes/ProfileRoutes.tsx
import { Route } from "react-router-dom";
import CreateProfile from "../pages/profile/Create";
import ProfileList from "../pages/profile/List";
import ProfileDetail from "../pages/profile/Detail";
import ProfileEdit from "../pages/profile/Edit";
import ProtectedRoute from "../components/ProtectedRoute";

const ProfileRoutes = [
  <Route
    key="profile-list"
    path="/profiles"
    element={
      <ProtectedRoute>
        <ProfileList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="profile-create"
    path="/profile/create"
    element={
      <ProtectedRoute>
        <CreateProfile />
      </ProtectedRoute>
    }
  />,
  <Route
    key="profile-detail"
    path="/profile/detail/:id"
    element={
      <ProtectedRoute>
        <ProfileDetail />
      </ProtectedRoute>
    }
  />,
  <Route
    key="profile-edit"
    path="/profile/edit/:id"
    element={
      <ProtectedRoute>
        <ProfileEdit />
      </ProtectedRoute>
    }
  />,
];

export default ProfileRoutes;
