// src/routes/ContactRoutes.tsx
import { Route } from "react-router-dom";
import CreateContact from "../pages/contact/Create";
import ContactList from "../pages/contact/List";
import ContactDetail from "../pages/contact/Detail";
import ContactEdit from "../pages/contact/Edit";
import ProtectedRoute from "../components/ProtectedRoute";

const ContactRoutes = [
  <Route
    key="contact-list"
    path="/contacts"
    element={
      <ProtectedRoute>
        <ContactList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="contact-create"
    path="/contact/create"
    element={
      <ProtectedRoute>
        <CreateContact />
      </ProtectedRoute>
    }
  />,
  <Route
    key="contact-detail"
    path="/contact/detail/:id"
    element={
      <ProtectedRoute>
        <ContactDetail />
      </ProtectedRoute>
    }
  />,
  <Route
    key="contact-edit"
    path="/contact/edit/:id"
    element={
      <ProtectedRoute>
        <ContactEdit />
      </ProtectedRoute>
    }
  />,
];

export default ContactRoutes;
