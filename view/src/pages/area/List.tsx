// src/pages/List.tsx
import React, { useEffect } from "react";
import { fetchAreas } from "../../store/slices/areaSlice";
import { AppState } from "../../store/store";
import { useEntityList } from "../../hooks/useEntityList";
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const areaColumns = [
  { header: "Code", accessor: "code" },
  { header: "Name", accessor: "name" },
];

const List: React.FC = () => {
  const entityState = useEntityList({
    listSelector: (state: AppState) => state.area.areas,
    fetchListAction: fetchAreas,
  });

  return (
    <GenericListPage
      title="Areas"
      entityState={entityState}
      columns={areaColumns}
      createRoute="/area/create"
      detailRouteBase="/area/detail"
      onRefresh={entityState.refresh}
      getKey={(area) => area.id}
    />
  );
};

export default List;
