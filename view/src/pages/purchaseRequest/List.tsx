// src/pages/List.tsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { fetchPurchaseRequests } from "../../store/slices/purchaseRequestSlice";
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
  const { purchaseRequests } = useSelector(
    (state: AppState) => state.purchaseRequest
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigte = useNavigate();

  const rowStyle = {
    textTransform: "capitalize",
    fontSize: 16,
  };

  useEffect(() => {
    if (tokens && !purchaseRequests.data && !purchaseRequests.loading) {
      dispatch(fetchPurchaseRequests());
    }
  }, []);

  const handleRefresh = () => {
    dispatch(fetchPurchaseRequests());
  };

  if (!tokens) {
    return <Typography>Please log in to view Purchase Requests.</Typography>;
  }
  const headers = [
    "Item",
    "UoM",
    "Quantity",
    "Received Quantity",
    "Requested Date",
    "Requested By",
    "Approved By",
    "Received Date",
    "Priority",
    "Status",
    "Action",
  ];

  return (
    <>
      <div className="flex gap-6 items-center">
        <Typography variant="h5" className="font-bold">
          Purchase Request
        </Typography>
        <Button component={Link} to="/purchase-request/create">
          New
        </Button>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={purchaseRequests.loading}
        >
          Refresh
        </Button>
      </div>
      {purchaseRequests.loading && <CircularProgress />}
      {purchaseRequests.error && (
        <Typography variant="body2" className="text-red-500">
          {purchaseRequests.error}
        </Typography>
      )}
      <ListTable headers={headers}>
        <TableBody>
          {purchaseRequests.data &&
            purchaseRequests.data.map((purchaseRequest) => (
              <TableRow key={purchaseRequest.id}>
                <TableCell>
                  <Typography sx={rowStyle} noWrap>
                    {purchaseRequest.item.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={rowStyle}>
                    {purchaseRequest.item.uom.code}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={rowStyle}>
                    {purchaseRequest.quantity}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography sx={rowStyle}>
                    {purchaseRequest.received_quantity}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography sx={rowStyle}>
                    {purchaseRequest.requested_date}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography sx={rowStyle}>
                    {purchaseRequest.requested_by}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography sx={rowStyle}>
                    {purchaseRequest.approved_by}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography sx={rowStyle}>
                    {purchaseRequest.received_date}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography sx={rowStyle}>
                    {purchaseRequest.priority}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography sx={rowStyle}>
                    {purchaseRequest.status}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/purchase-request/detail/${purchaseRequest.id}`}
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
