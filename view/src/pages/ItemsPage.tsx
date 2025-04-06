// src/pages/ItemsPage.tsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchItems } from "../store/slices/authSlice";
import { AppState, AppDispatch } from "../store/store";
import {
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Link } from "react-router-dom";

const ItemsPage: React.FC = () => {
  const { tokens, items } = useSelector((state: AppState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (tokens && !items.data && !items.loading) {
      dispatch(fetchItems());
    }
  }, [tokens, items.data, items.loading, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchItems());
  };

  if (!tokens) {
    return <Typography>Please log in to view items.</Typography>;
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <Typography variant="h4">Inventory Items</Typography>
        <Button component={Link} to="/items/create">
          Add Item
        </Button>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={items.loading}
        >
          Refresh
        </Button>
      </div>
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
              <TableCell>Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>UOM Code</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.no}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.uom.code}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default ItemsPage;
