// src/pages/List.tsx
import React, { useEffect } from "react";
import { fetchPurchaseSchedules } from "../../store/slices/purchaseScheduleSlice";
import { AppState } from "../../store/store";
import { useEntityList } from "../../hooks/useEntityList";
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const purchaseScheduleColumns = [
  { header: "Name", accessor: "name" },
  { header: "Email", accessor: "email" },
  { header: "Phone No.", accessor: "phone_no" },
  { header: "Location", accessor: "location" },
];

const List: React.FC = () => {
  const entityState = useEntityList({
    listSelector: (state: AppState) => state.purchaseSchedule.purchaseSchedules,
    fetchListAction: fetchPurchaseSchedules,
  });

  return (
    <GenericListPage
      title="PurchaseSchedules"
      entityState={entityState}
      columns={purchaseScheduleColumns}
      createRoute="/purchase-schedule/create"
      detailRouteBase="/purchase-schedule/detail"
      onRefresh={entityState.refresh}
      getKey={(purchaseSchedule) => purchaseSchedule.id}
    />
  );
};

export default List;
