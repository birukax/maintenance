// src/pages/List.tsx
import React, { useEffect } from "react";
import { fetchActivities } from "../../store/slices/activitySlice";
import { AppState } from "../../store/store";
import { useEntityList } from "../../hooks/useEntityList";
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const activityColumns = [
  { header: "Code", accessor: "code" },
  { header: "Name", accessor: "name" },
  { header: "Work Order Type", accessor: "work_order_type" },
];

const List: React.FC = () => {
  const entityState = useEntityList({
    listSelector: (state: AppState) => state.activity.activities,
    fetchListAction: fetchActivities,
  });

  return (
    <GenericListPage
      title="Activities"
      entityState={entityState}
      columns={activityColumns}
      createRoute="/activity/create"
      detailRouteBase="/activity/detail"
      onRefresh={entityState.refresh}
      getKey={(activity) => activity.id}
    />
  );
};

export default List;
