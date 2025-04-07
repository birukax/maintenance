// src/pages/List.tsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchItems } from "../../store/slices/authSlice";
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
  const headers = ["ID", "Name", "Type", "Category", "UoM Code"];

  return (
    <>
      <div className="flex justify-between items-center">
        <Typography variant="h5" className="font-bold">
          Inventory Items
        </Typography>
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
      <ListTable headers={headers}>
        <TableBody>
          {items.data &&
            items.data.map((item) => (
              <TableRow>
                <TableCell>{item.no}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.uom.code}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </ListTable>
    </>
  );
};

export default List;
