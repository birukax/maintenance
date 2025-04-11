// src/pages/List.tsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { fetchMachines } from "../../store/slices/machineSlice";
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
  const { machines } = useSelector((state: AppState) => state.machine);
  const dispatch = useDispatch<AppDispatch>();
  const navigte = useNavigate();

  useEffect(() => {
    if (tokens) {
      dispatch(fetchMachines());
    }
  }, []);

  const handleRefresh = () => {
    dispatch(fetchMachines());
  };

  if (!tokens) {
    return <Typography>Please log in to view machines.</Typography>;
  }
  const headers = ["Item", "UoM", "Quantity", "Action"];

  return (
    <>
      <div className="flex justify-between contacts-center">
        <Typography variant="h5" className="font-bold">
          Machines
        </Typography>
        <Button component={Link} to="/machine/create">
          New
        </Button>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={machines.loading}
        >
          Refresh
        </Button>
      </div>
      {machines.loading && <CircularProgress />}
      {machines.error && (
        <Typography variant="body2" className="text-red-500">
          {machines.error}
        </Typography>
      )}
      <ListTable headers={headers}>
        <TableBody>
          {machines.data &&
            machines.data.map((machine) => (
              <TableRow key={machine.id}>
                <TableCell>{machine.item.name}</TableCell>
                <TableCell>{machine.item.uom.code}</TableCell>
                <TableCell>{machine.quantity}</TableCell>
                <TableCell>
                  <Button component={Link} to={`/machine/detail/${machine.id}`}>
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
