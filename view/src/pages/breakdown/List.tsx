// src/pages/List.tsx
import React, { useEffect } from "react";
import { fetchBreakdowns } from "../../store/slices/breakdownSlice";
import { AppState } from "../../store/store";
import { useEntityList } from "../../hooks/useEntityList";
import { GenericListPage } from "../../components/GenericListPage";

const breakdownColumns = [
  { header: "Machine", accessor: "machine.name" },
  { header: "Equipment", accessor: "equipment.name" },
  { header: "Start Date", accessor: "start_date" },
  { header: "Start Time (h:m:S)", accessor: "start_time" },
  // { header: "Planned Time (s)", accessor: "planned_time" },
];

const List: React.FC = () => {
  const entityState = useEntityList({
    listSelector: (state: AppState) => state.breakdown.breakdowns,
    fetchListAction: fetchBreakdowns,
  });

  return (
    <GenericListPage
      title="Breakdown"
      entityState={entityState}
      columns={breakdownColumns}
      createRoute="/breakdown/create"
      detailRouteBase="/breakdown/detail"
      onRefresh={entityState.refresh}
      getKey={(breakdown) => breakdown.id}
    />
  );
};

export default List;
