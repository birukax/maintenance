// src/pages/List.tsx
import React, { useEffect } from "react";
import { fetchMachines } from "../../store/slices/machineSlice";
import { AppState } from "../../store/store";
import { useEntityList } from "../../hooks/useEntityList";
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const machineColumns = [
  { header: "Code", accessor: "code" },
  { header: "Name", accessor: "name" },
  { header: "location", accessor: "location.name" },
];

const List: React.FC = () => {
  const entityState = useEntityList({
    listSelector: (state: AppState) => state.machine.machines,
    fetchListAction: fetchMachines,
  });

  return (
    <GenericListPage
      title="Machines"
      entityState={entityState}
      columns={machineColumns}
      createRoute="/machine/create"
      detailRouteBase="/machine/detail"
      onRefresh={entityState.refresh}
      getKey={(machine) => machine.id}
    />
  );
};

export default List;
