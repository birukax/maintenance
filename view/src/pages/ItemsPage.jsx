import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchItems } from "../store/authSlice";
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

const ItemsPage = () => {
  const { tokens, items } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    if (tokens && !items.data && !items.loading) {
      dispatch(fetchItems());
    }
  }, [tokens, items.data, items.loading, dispatch]);
  if (!tokens)
    return <Typography>Please log in to view the dashboard.</Typography>;

  return (
    <Container className="mt-8">
      <Typography variant="h4" className="mb-4">
        Inventory Items
      </Typography>
      {items.loading && <CircularProgress />}
      {items.error && (
        <Typography variant="body2" className="text-red-500">
          {items.error}
        </Typography>
      )}
      {items.data && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              {/* Add more headers based on your data */}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.no}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.uom.name}</TableCell>
                {/* Add more fields */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
};

export default ItemsPage;
