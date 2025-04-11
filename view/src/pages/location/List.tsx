// src/pages/List.tsx
import React, { useEffect } from "react";
import { fetchLocations } from "../../store/slices/locationSlice";
import { AppState } from "../../store/store";
import { useEntityList } from "../../hooks/useEntityList";
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const locationColumns = [
  { header: "Code", accessor: "code" },
  { header: "Name", accessor: "name" },
];

const List: React.FC = () => {
  const entityState = useEntityList({
    listSelector: (state: AppState) => state.location.locations,
    fetchListAction: fetchLocations,
  });

  return (
    <GenericListPage
      title="Locations"
      entityState={entityState}
      columns={locationColumns}
      createRoute="/location/create"
      detailRouteBase="/location/detail"
      onRefresh={entityState.refresh}
      getKey={(location) => location.id}
    />
  );
};

export default List;
