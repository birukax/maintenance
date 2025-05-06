// src/pages/List.tsx
import React, { useEffect } from "react";
import { fetchPlants } from "../../store/slices/plantSlice";
import { AppState } from "../../store/store";
import { useEntityList } from "../../hooks/useEntityList";
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const plantColumns = [
  { header: "Code", accessor: "code" },
  { header: "Name", accessor: "name" },
];

const List: React.FC = () => {
  const entityState = useEntityList({
    listSelector: (state: AppState) => state.plant.plants,
    fetchListAction: fetchPlants,
  });

  return (
    <GenericListPage
      title="Plants"
      entityState={entityState}
      columns={plantColumns}
      createRoute="/plant/create"
      detailRouteBase="/plant/detail"
      onRefresh={entityState.refresh}
      getKey={(plant) => plant.id}
    />
  );
};

export default List;
