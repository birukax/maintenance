// src/pages/List.tsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { fetchContacts } from "../../store/slices/contactSlice";
import { AppState, AppDispatch } from "../../store/store";
import {
  Typography,
  CircularProgress,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ListTable from "../../partials/ListTable";
import { Link } from "react-router-dom";

const List: React.FC = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);
  const { contacts } = useSelector((state: AppState) => state.contact);
  const dispatch = useDispatch<AppDispatch>();
  const navigte = useNavigate();

  useEffect(() => {
    if (tokens) {
      dispatch(fetchContacts());
    }
  }, [tokens, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchContacts());
  };

  if (!tokens) {
    return <Typography>Please log in to view contacts.</Typography>;
  }
  const headers = ["Name", "Email", "Phone No.", "Location", "Detail"];

  return (
    <>
      <div className="flex justify-between contacts-center">
        <Typography variant="h5" className="font-bold">
          Contacts
        </Typography>
        <Button component={Link} to="/contacts/create">
          Add Contact
        </Button>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={contacts.loading}
        >
          Refresh
        </Button>
      </div>
      {contacts.loading && <CircularProgress />}
      {contacts.error && (
        <Typography variant="body2" className="text-red-500">
          {contacts.error}
        </Typography>
      )}
      <ListTable headers={headers}>
        <TableBody>
          {contacts.data &&
            contacts.data.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone_no}</TableCell>
                <TableCell>{contact.location}</TableCell>
                <TableCell>
                  <Button component={Link} to={`/contact/detail/${contact.id}`}>
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </ListTable>
    </>
  );
};

export default List;
