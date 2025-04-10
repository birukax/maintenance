// src/pages/List.tsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { fetchReturns } from "../../store/slices/returnSlice";
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
  const { returns } = useSelector((state: AppState) => state.return);
  const dispatch = useDispatch<AppDispatch>();
  const navigte = useNavigate();

  useEffect(() => {
    if (tokens) {
      dispatch(fetchReturns());
    }
  }, []);

  const handleRefresh = () => {
    dispatch(fetchReturns());
  };

  if (!tokens) {
    return <Typography>Please log in to view returns.</Typography>;
  }
  const headers = ["Item", "UoM", "Quantity", "Used", "Action"];

  return (
    <>
      <div className="flex justify-between contacts-center">
        <Typography variant="h5" className="font-bold">
          Returns
        </Typography>
        <Button component={Link} to="/return/create">
          New
        </Button>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={returns.loading}
        >
          Refresh
        </Button>
      </div>
      {returns.loading && <CircularProgress />}
      {returns.error && (
        <Typography variant="body2" className="text-red-500">
          {returns.error}
        </Typography>
      )}
      <ListTable headers={headers}>
        <TableBody>
          {returns.data &&
            returns.data.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.item.name}</TableCell>
                <TableCell>{r.item.uom.code}</TableCell>
                <TableCell>{r.quantity}</TableCell>
                <TableCell>{r.used === true ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Button component={Link} to={`/return/detail/${r.id}`}>
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
