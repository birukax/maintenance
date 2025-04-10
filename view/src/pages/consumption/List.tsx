// src/pages/List.tsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { fetchConsumptions } from "../../store/slices/consumptionSlice";
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
  const { consumptions } = useSelector((state: AppState) => state.consumption);
  const dispatch = useDispatch<AppDispatch>();
  const navigte = useNavigate();

  useEffect(() => {
    if (tokens) {
      dispatch(fetchConsumptions());
    }
  }, []);

  const handleRefresh = () => {
    dispatch(fetchConsumptions());
  };

  if (!tokens) {
    return <Typography>Please log in to view consumptions.</Typography>;
  }
  const headers = ["Item", "UoM", "Quantity", "Action"];

  return (
    <>
      <div className="flex justify-between contacts-center">
        <Typography variant="h5" className="font-bold">
          Consumptions
        </Typography>
        <Button component={Link} to="/consumption/create">
          New
        </Button>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={consumptions.loading}
        >
          Refresh
        </Button>
      </div>
      {consumptions.loading && <CircularProgress />}
      {consumptions.error && (
        <Typography variant="body2" className="text-red-500">
          {consumptions.error}
        </Typography>
      )}
      <ListTable headers={headers}>
        <TableBody>
          {consumptions.data &&
            consumptions.data.map((consumption) => (
              <TableRow key={consumption.id}>
                <TableCell>{consumption.item.name}</TableCell>
                <TableCell>{consumption.item.uom.code}</TableCell>
                <TableCell>{consumption.quantity}</TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/consumption/detail/${consumption.id}`}
                  >
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
