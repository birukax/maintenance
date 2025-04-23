// src/pages/List.tsx
import React, { useEffect } from "react";
import { fetchWorkOrderTypes } from "../../store/slices/workOrderTypeSlice";
import { AppState } from "../../store/store";
import { useEntityList } from "../../hooks/useEntityList";
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const workOrderTypeColumns = [
  { header: "Code", accessor: "code" },
  { header: "Name", accessor: "name" },
  { header: "Scheduled", accessor: "scheduled" },
  { header: "Breakdown", accessor: "breakdown" },
];

const List: React.FC = () => {
  const entityState = useEntityList({
    listSelector: (state: AppState) => state.workOrderType.workOrderTypes,
    fetchListAction: fetchWorkOrderTypes,
  });

  
  return (
    <GenericListPage
      title="Work Order Types"
      entityState={entityState}
      columns={workOrderTypeColumns}
      createRoute="/work-order-type/create"
      detailRouteBase="/work-order-type/detail"
      onRefresh={entityState.refresh}
      getKey={(workOrderType) => workOrderType.id}
    />
  );
};

export default List;
