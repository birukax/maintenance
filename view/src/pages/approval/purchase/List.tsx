// src/pages/List.tsx
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  fetchPurchaseApprovals,
  approvePurchaseApproval,
  rejectPurchaseApproval,
} from "../../../store/slices/purchaseApprovalSlice";
import { AppState, AppDispatch } from "../../../store/store";

import { useEntityList } from "../../../hooks/useEntityList";
import { GenericListPage } from "../../../components/GenericListPage";

import { toast } from "react-toastify";

const purchaseApprovalColumns = [
  { header: "Item", accessor: "purchase_request.item.name" },
  { header: "UoM", accessor: "purchase_request.item.uom.code" },
  { header: "Quantity", accessor: "purchase_request.quantity" },
  {
    header: "Requested By",
    accessor: "purchase_request.requested_by.username",
  },
  { header: "Priority", accessor: "purchase_request.priority" },
  { header: "Status", accessor: "status" },
];
const List: React.FC = () => {
  const entityState = useEntityList({
    listSelector: (state: AppState) => state.purchaseApproval.purchaseApprovals,
    fetchListAction: fetchPurchaseApprovals,
  });
  const dispatch = useDispatch<AppDispatch>();
  const [handlers, setHandlers] = React.useState(false);

  const handleApprove = async (id) => {
    await dispatch(approvePurchaseApproval(id)).unwrap();
    toast.success("Purchase Approved");
    dispatch(fetchPurchaseApprovals());
    // setHandlers((prev) => !prev);
    handleRefresh();
  };

  const handleReject = async (id) => {
    await dispatch(rejectPurchaseApproval(id)).unwrap();
    toast.success("Purchase Rejected");
    dispatch(fetchPurchaseApprovals());
    // setHandlers((prev) => !prev);
    handleRefresh();
  };

  const handleRefresh = () => {
    dispatch(fetchPurchaseApprovals()).unwrap();
  };
  


  return (
    <GenericListPage
      title="Purchase Approval"
      entityState={entityState}
      columns={purchaseApprovalColumns}
      onRefresh={entityState.refresh}
      hasDetail={false}
      hasApproval={true}
      onApprove={(id) => handleApprove(id)}
      onReject={(id) => handleReject(id)}
      getKey={(purchaseApproval) => purchaseApproval.id}
    />
  );
};

export default List;
