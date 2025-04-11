// src/pages/List.tsx
import React, { useEffect } from "react";
import { fetchEquipments } from "../../store/slices/equipmentSlice";
import { AppState } from "../../store/store";
import { useEntityList } from "../../hooks/useEntityList";
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const equipmentColumns = [
  { header: "Code", accessor: "code" },
  { header: "Name", accessor: "name" },
  { header: "machine", accessor: "machine.name" },
];

const List: React.FC = () => {
  const entityState = useEntityList({
    listSelector: (state: AppState) => state.equipment.equipments,
    fetchListAction: fetchEquipments,
  });

  return (
    <GenericListPage
      title="Equipments"
      entityState={entityState}
      columns={equipmentColumns}
      createRoute="/equipment/create"
      detailRouteBase="/equipment/detail"
      onRefresh={entityState.refresh}
      getKey={(equipment) => equipment.id}
    />
  );
};

export default List;
