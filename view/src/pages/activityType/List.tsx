// src/pages/List.tsx
import React, { useEffect } from "react";
import { fetchActivityTypes } from "../../store/slices/activityTypeSlice";
import { AppState } from "../../store/store";
import { useEntityList } from "../../hooks/useEntityList";
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const activityTypeColumns = [
  { header: "Code", accessor: "code" },
  { header: "Work Order Type", accessor: "work_order_type" },
];

const List: React.FC = () => {
  const entityState = useEntityList({
    listSelector: (state: AppState) => state.activityType.activityTypes,
    fetchListAction: fetchActivityTypes,
  });

  return (
    <GenericListPage
      title="Activity Types"
      entityState={entityState}
      columns={activityTypeColumns}
      createRoute="/activity-type/create"
      detailRouteBase="/activity-type/detail"
      onRefresh={entityState.refresh}
      getKey={(activityType) => activityType.id}
    />
  );
};

export default List;
