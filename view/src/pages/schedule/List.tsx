// src/pages/List.tsx
import React, { useEffect } from "react";
import { fetchSchedules } from "../../store/slices/scheduleSlice";
import { AppState } from "../../store/store";
import { useEntityList } from "../../hooks/useEntityList";
import { GenericListPage } from "../../components/GenericListPage";

const scheduleColumns = [
  { header: "Machine", accessor: "machine.name" },
  { header: "Equipment", accessor: "equipment.name" },
  { header: "Work Order Type", accessor: "work_order_type.name" },
  { header: "Activity Type", accessor: "activity_type.name" },
  { header: "Planned Time (h:m:s)", accessor: "planned_time" },
];

const List: React.FC = () => {
  const entityState = useEntityList({
    listSelector: (state: AppState) => state.schedule.schedules,
    fetchListAction: fetchSchedules,
  });

  return (
    <GenericListPage
      title="Schedule"
      entityState={entityState}
      columns={scheduleColumns}
      createRoute="/schedule/create"
      detailRouteBase="/schedule/detail"
      onRefresh={entityState.refresh}
      getKey={(schedule) => schedule.id}
    />
  );
};

export default List;
