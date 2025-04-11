// src/pages/List.tsx
import React, { useEffect } from "react";
import { fetchPurchaseRequests } from "../../store/slices/purchaseRequestSlice";
import { AppState } from "../../store/store";
import { useEntityList } from "../../hooks/useEntityList";
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const purchaseRequestColumns = [
  { header: "Item", accessor: "item.name" },
  { header: "Quantity", accessor: "quantity" },
  { header: "Requested Date", accessor: "requested_date" },
  { header: "Priority", accessor: "priority" },
  { header: "Status", accessor: "status" },
];

const List: React.FC = () => {
  const entityState = useEntityList({
    listSelector: (state: AppState) => state.purchaseRequest.purchaseRequests,
    fetchListAction: fetchPurchaseRequests,
  });

  return (
    <GenericListPage
      title="Purchase Requests"
      entityState={entityState}
      columns={purchaseRequestColumns}
      createRoute="/purchase-request/create"
      detailRouteBase="/purchase-request/detail"
      onRefresh={entityState.refresh}
      getKey={(purchaseRequest) => purchaseRequest.id}
    />
  );
};

export default List;
