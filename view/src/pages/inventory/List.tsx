// src/pages/List.tsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import {
  fetchInventories,
  revaluateStock,
} from "../../store/slices/inventorySlice";
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
  const { inventories } = useSelector((state: AppState) => state.inventory);
  const dispatch = useDispatch<AppDispatch>();
  const navigte = useNavigate();

  useEffect(() => {
    if (tokens) {
      dispatch(fetchInventories());
    }
  }, []);

  const handleRefresh = () => {
    dispatch(revaluateStock());
  };

  if (!tokens) {
    return <Typography>Please log in to view inventories.</Typography>;
  }
  const headers = [
    "Item",
    "UoM",
    "Balance",
    "Purchased Quantity",
    "Consumed Quantity",
    "Returned Quantity",
  ];

  return (
    <>
      <div className="flex justify-between inventories-center">
        <Typography variant="h5" className="font-bold">
          Inventory List
        </Typography>

        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={inventories.loading}
        >
          Refresh
        </Button>
      </div>
      {inventories.loading && <CircularProgress />}
      {inventories.error && (
        <Typography variant="body2" className="text-red-500">
          {inventories.error}
        </Typography>
      )}
      <ListTable headers={headers}>
        <TableBody>
          {inventories.data &&
            inventories.data.map((inventory) => (
              <TableRow key={inventory.id}>
                <TableCell>{inventory.item.name}</TableCell>
                <TableCell>{inventory.item.uom.code}</TableCell>
                <TableCell>{inventory.balance}</TableCell>
                <TableCell>{inventory.purchased_quantity}</TableCell>
                <TableCell>{inventory.consumed_quantity}</TableCell>
                <TableCell>{inventory.returned_quantity}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </ListTable>
    </>
  );
};

export default List;
