// src/pages/List.tsx
import React, { useEffect } from "react";
import { fetchWorkOrders } from "../../store/slices/workOrderSlice";
import { AppState } from "../../store/store";
import { useEntityList } from "../../hooks/useEntityList";
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const workOrderColumns = [
  { header: "Machine", accessor: "machine.name" },
  { header: "Equipment", accessor: "equipment.name" },
  { header: "Activity Type", accessor: "activity_type.name" },
  { header: "Total Time Required (h:m:s)", accessor: "total_time_required" },
];

const List: React.FC = () => {
  const entityState = useEntityList({
    listSelector: (state: AppState) => state.workOrder.workOrders,
    fetchListAction: fetchWorkOrders,
  });

  return (
    <GenericListPage
      title="Work Order"
      entityState={entityState}
      columns={workOrderColumns}
      createRoute="/work-order/create"
      detailRouteBase="/work-order/detail"
      onRefresh={entityState.refresh}
      getKey={(workOrder) => workOrder.id}
    />
  );
};

export default List;
