// src/pages/List.tsx
import React, { useEffect } from "react";
import { fetchPurchaseSchedules } from "../../store/slices/purchaseScheduleSlice";
import { AppState } from "../../store/store";
import { useEntityList } from "../../hooks/useEntityList";
import { MONTH_NAMES } from "../../utils/choices";
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const purchaseScheduleColumns = [
  { header: "Item", accessor: "item.name" },
  { header: "UoM", accessor: "item.uom.name" },
  { header: "Balance", accessor: "item.inventory.balance" },
  { header: "Min Stock Level", accessor: "minimum_stock_level" },
  { header: "Quantity", accessor: "quantity" },
];
const List: React.FC = () => {
  const entityState = useEntityList({
    listSelector: (state: AppState) => state.purchaseSchedule.purchaseSchedules,
    fetchListAction: fetchPurchaseSchedules,
  });

  const extraColumns = MONTH_NAMES.map(([monthNumber, monthName]) => ({
    headers: monthName,
    number: monthNumber,
  }));

  return (
    <GenericListPage
      title="Purchase Schedules"
      entityState={entityState}
      columns={purchaseScheduleColumns}
      extraColumns={extraColumns}
      createRoute="/purchase-schedule/create"
      detailRouteBase="/purchase-schedule/detail"
      onRefresh={entityState.refresh}
      getKey={(purchaseSchedule) => purchaseSchedule.id}
    />
  );
};

export default List;
