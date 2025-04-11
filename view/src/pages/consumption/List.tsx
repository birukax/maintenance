// src/pages/List.tsx
import React, { useEffect } from "react";
import { fetchConsumptions } from "../../store/slices/consumptionSlice";
import { AppState } from "../../store/store";
import { useEntityList } from "../../hooks/useEntityList";
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const consumptionColumns = [
  { header: "Item", accessor: "item.name" },
  { header: "Quantity", accessor: "quantity" },
];

const List: React.FC = () => {
  const entityState = useEntityList({
    listSelector: (state: AppState) => state.consumption.consumptions,
    fetchListAction: fetchConsumptions,
  });

  return (
    <GenericListPage
      title="Consumptions"
      entityState={entityState}
      columns={consumptionColumns}
      createRoute="/consumption/create"
      detailRouteBase="/consumption/detail"
      onRefresh={entityState.refresh}
      getKey={(consumption) => consumption.id}
    />
  );
};

export default List;
