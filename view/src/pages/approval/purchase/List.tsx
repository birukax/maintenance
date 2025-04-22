// src/pages/List.tsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import {
  fetchPurchaseApprovals,
  approvePurchaseApproval,
  rejectPurchaseApproval,
} from "../../../store/slices/purchaseApprovalSlice";
import { AppState, AppDispatch } from "../../../store/store";
import {
  Typography,
  CircularProgress,
  TableBody,
  TableRow,
  TableCell,
  ButtonGroup,
  Button,
  ListItem,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ListTable from "../../../partials/ListTable";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const List: React.FC = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);
  const { purchaseApprovals } = useSelector(
    (state: AppState) => state.purchaseApproval
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigte = useNavigate();
  const [handlers, setHandlers] = React.useState(false);

  const handleApprove = (id) => {
    dispatch(approvePurchaseApproval(id)).unwrap();
    toast.success("Purchase Approved");
    setHandlers(prev=>!prev);
    handleRefresh();
  };

  const handleReject = (id) => {
    dispatch(rejectPurchaseApproval(id)).unwrap();
    toast.success("Purchase Rejected");
    setHandlers(prev=>!prev);
    handleRefresh();
  };

  useEffect(() => {
    dispatch(fetchPurchaseApprovals());
  }, [handlers]);


  const handleRefresh = () => {
    dispatch(fetchPurchaseApprovals()).unwrap();
  };

  if (!tokens) {
    return <Typography>Please log in to view purchaseApprovals.</Typography>;
  }
  const headers = ["Item", "UoM", "Quantity", "Requested By", "Priority","Status"];

  return (
    <>
      <div className="flex justify-between purchaseApprovals-center">
        <Typography variant="h5" className="font-bold">
          Purchase Approval List
        </Typography>

        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={purchaseApprovals.loading}
        >
          Refresh
        </Button>
      </div>
      {purchaseApprovals.loading && <CircularProgress />}
      {purchaseApprovals.error && (
        <Typography variant="body2" className="text-red-500">
          {purchaseApprovals.error}
        </Typography>
      )}
      <ListTable headers={headers}>
        {/* <TableBody> */}
          {purchaseApprovals.data &&
            purchaseApprovals.data.map((purchaseApproval) => (
              <TableRow key={purchaseApproval.id}>
                <TableCell>
                  {purchaseApproval.purchase_request &&
                    purchaseApproval.purchase_request.item.name}
                </TableCell>
                <TableCell>
                  {purchaseApproval.purchase_request &&
                    purchaseApproval.purchase_request.item.uom.code}
                </TableCell>
                <TableCell>
                  {purchaseApproval.purchase_request &&
                    purchaseApproval.purchase_request.quantity}
                </TableCell>

                <TableCell>
                  {purchaseApproval.purchase_request &&
                    purchaseApproval.purchase_request.requested_by.username}
                </TableCell>
                <TableCell>
                  {purchaseApproval.purchase_request &&
                    purchaseApproval.purchase_request.priority}
                </TableCell>

                <TableCell>{purchaseApproval.status}</TableCell>
                <TableCell>
                  {purchaseApproval.status === "PENDING" && (
                    <ButtonGroup variant="contained" size="small" sx={{display: "flex", gap: 1,boxShadow:0}}>
                      <Button
                        onClick={() => handleApprove(purchaseApproval.id)}
                        disabled={purchaseApprovals.loading}
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(purchaseApproval.id)}
                        disabled={purchaseApprovals.loading}
                      >
                        Reject
                      </Button>
                    </ButtonGroup>
                  )}
                </TableCell>
              </TableRow>
            ))}
        {/* </TableBody> */}
      </ListTable>
    </>
  );
};

export default List;
