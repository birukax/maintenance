import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchWorkOrder } from "../../store/slices/workOrderSlice";
import { updateWorkOrderActivity } from "../../store/slices/workOrderActivitySlice";
import { AppState, AppDispatch } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import EditRows from "./EditRows";
// import Submit from "./Submit";
import {
  Typography,
  Button,
  Modal,
  TableRow,
  TableBody,
  Table,
  TableHead,
  TableCell,
  TextField,
  Checkbox,
} from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { fetchPurchaseSchedules, updatePurchaseSchedule } from "../../store/slices/purchaseScheduleSlice";

const Edit = ({ setEdit }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = {
    year__no: searchParams.get("year__no"),
  };
  const { purchaseSchedules } = useSelector(
    (state: AppState) => state.purchaseSchedule
  );
  const dispatch = useDispatch<AppDispatch>();

  const renderButtons = () => <></>;
  useEffect(() => {
    dispatch(fetchPurchaseSchedules(params));
  }, []);

  
  const handleRefresh = async () => {
    try {
      await dispatch(fetchPurchaseSchedules(params)).unwrap();
    } catch (error) {
      console.error("Failed to refresh work order:", error);
    }
  };

  const handlePurchaseSchedule = async (id, field, newValue) => {
    const formData = {
      [field]: newValue,
    };
    try {
      await dispatch(updatePurchaseSchedule({ id, formData })).unwrap();
      handleRefresh();
    } catch (error) {
      console.error("Failed to update activity:", error);
    }
  };
  const purchaseScheduleColumns = [
    "Item No",
    "Item",
    "UoM",
    "Balance",
    "Min Stock Level",
    "Year",
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
  ];
  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          onClick={() => {
            setEdit(false);
            setSearchParams(params);
          }}
          sx={{ mr: 1 }}
        >
          Save
        </Button>
      </div>
      <Table sx={{ minWidth: 650 }} aria-label={` table`}>
        <TableHead>
          <TableRow>
            {purchaseScheduleColumns.map((column) => (
              <TableCell key={column}>
                <Typography noWrap>{column}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {purchaseSchedules.data &&
            purchaseSchedules.data.map((row) => (
              <EditRows
                key={row.id}
                row={row}
                handleUpdateSchedule={handlePurchaseSchedule}
              />
            ))}
        </TableBody>
      </Table>
    </>
  );
};

export default Edit;
