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
  { header: "Min Stock Level", accessor: "item.minimum_stock_level" },
  { header: "Year", accessor: "year" },
  { header: "Quantity", accessor: "quantity" },
  { header: "January", accessor: "monthly_schedule.january" },
  { header: "February", accessor: "monthly_schedule.february" },
  { header: "March", accessor: "monthly_schedule.march" },
  { header: "April", accessor: "monthly_schedule.april" },
  { header: "May", accessor: "monthly_schedule.may" },
  { header: "June", accessor: "monthly_schedule.june" },
  { header: "July", accessor: "monthly_schedule.july" },
  { header: "August", accessor: "monthly_schedule.august" },
  { header: "September", accessor: "monthly_schedule.september" },
  { header: "October", accessor: "monthly_schedule.october" },
  { header: "November", accessor: "monthly_schedule.november" },
  { header: "December", accessor: "monthly_schedule.december" },
];
const List: React.FC = () => {
  const entityState = useEntityList({
    listSelector: (state: AppState) => state.purchaseSchedule.purchaseSchedules,
    fetchListAction: fetchPurchaseSchedules,
  });

  return (
    <GenericListPage
      title="Purchase Schedules"
      entityState={entityState}
      columns={purchaseScheduleColumns}
      createRoute="/purchase-schedule/create"
      // detailRouteBase="/purchase-schedule/detail"
      hasDetail={false}
      onRefresh={entityState.refresh}
      getKey={(purchaseSchedule) => purchaseSchedule.id}
    />
  );
};

export default List;
