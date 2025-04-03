// src/pages/ContactsPage.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchContacts } from "../store/authSlice";
import {
  Typography,
  Container,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const ContactsPage = () => {
  const { tokens, contacts } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (tokens && !contacts.data && !contacts.loading) {
      dispatch(fetchContacts());
    }
  }, [tokens, contacts.data, contacts.loading, dispatch]);

  if (!tokens) return <Typography>Please log in.</Typography>;

  return (
    <Container className="mt-8">
      <Typography variant="h4" className="mb-4">
        Inventory Contacts
      </Typography>
      {contacts.loading && <CircularProgress />}
      {contacts.error && (
        <Typography variant="body2" className="text-red-500">
          {contacts.error}
        </Typography>
      )}
      {contacts.data && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              {/* Adjust headers */}
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.data.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>{contact.id}</TableCell>
                <TableCell>{contact.name}</TableCell>
                {/* Add more fields */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
};

export default ContactsPage;
