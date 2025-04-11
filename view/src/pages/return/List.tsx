// src/pages/List.tsx
import React, { useEffect } from "react";
import { fetchReturns } from "../../store/slices/returnSlice";
import { AppState } from "../../store/store";
import { useEntityList } from "../../hooks/useEntityList";
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const returnColumns = [
  { header: "Item", accessor: "item.name" },
  { header: "UoM", accessor: "item.uom.name" },
  { header: "Quantity", accessor: "quantity" },
];

const List: React.FC = () => {
  const entityState = useEntityList({
    listSelector: (state: AppState) => state.return.returns,
    fetchListAction: fetchReturns,
  });

  return (
    <GenericListPage
      title="Returns"
      entityState={entityState}
      columns={returnColumns}
      createRoute="/return/create"
      detailRouteBase="/return/detail"
      onRefresh={entityState.refresh}
      getKey={(ret) => ret.id}
    />
  );
};

export default List;
