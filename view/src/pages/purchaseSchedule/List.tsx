// src/pages/List.tsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { fetchPurchaseSchedules } from "../../store/slices/purchaseScheduleSlice";
import { AppState, AppDispatch } from "../../store/store";
import { MONTH_NAMES } from "../../utils/choices";
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
  const { purchaseSchedules } = useSelector(
    (state: AppState) => state.purchaseSchedule
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigte = useNavigate();

  const rowStyle = {
    textTransform: "capitalize",
    fontSize: 16,
  };

  useEffect(() => {
    if (tokens && !purchaseSchedules.data && !purchaseSchedules.loading) {
      dispatch(fetchPurchaseSchedules());
    }
  }, []);

  const handleRefresh = () => {
    dispatch(fetchPurchaseSchedules());
  };

  if (!tokens) {
    return <Typography>Please log in to view Purchase Schedules.</Typography>;
  }
  const headers = [
    "Item",
    "UoM",
    "Min Stock Level",
    "Quantity",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "Action",
  ];

  return (
    <>
      <div className="flex gap-6 items-center">
        <Typography variant="h5" className="font-bold">
          Purchase Schedule
        </Typography>
        <Button component={Link} to="/purchase-schedule/create">
          New
        </Button>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={purchaseSchedules.loading}
        >
          Refresh
        </Button>
      </div>
      {purchaseSchedules.loading && <CircularProgress />}
      {purchaseSchedules.error && (
        <Typography variant="body2" className="text-red-500">
          {purchaseSchedules.error}
        </Typography>
      )}
      <ListTable headers={headers}>
        <TableBody>
          {purchaseSchedules.data &&
            purchaseSchedules.data.map((purchaseSchedule) => (
              <TableRow key={purchaseSchedule.id}>
                <TableCell>
                  <Typography sx={rowStyle} noWrap>
                    {purchaseSchedule.item.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={rowStyle}>
                    {purchaseSchedule.item.uom.code}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={rowStyle}>
                    {purchaseSchedule.minimum_stock_level}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={rowStyle}>
                    {purchaseSchedule.quantity}
                  </Typography>
                </TableCell>
                {MONTH_NAMES.map(([monthNumber, monthName]) => {
                  const schedule =
                    purchaseSchedule.monthly_purchase_schedules.find(
                      (s) => s.month === monthNumber
                    );
                  return (
                    <TableCell>
                      <Typography color="info" sx={rowStyle}>
                        {schedule ? schedule.quantity : 0.0}
                      </Typography>
                    </TableCell>
                  );
                })}
                <TableCell>
                  <Button
                    component={Link}
                    to={`/purchase-schedule/detail/${purchaseSchedule.id}`}
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
