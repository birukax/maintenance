// src/pages/List.tsx
import React, { useEffect } from "react";
import { fetchItems } from "../../store/slices/itemSlice";
import { AppState } from "../../store/store";
import { useEntityList } from "../../hooks/useEntityList";
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const itemColumns = [
  { header: "ID", accessor: "no" },
  { header: "Name", accessor: "name" },
  { header: "UoM", accessor: "uom.name" },
  { header: "Type", accessor: "type" },
  { header: "Category", accessor: "category" },
  { header: "Supplier", accessor: "supplier" }
];

const List: React.FC = () => {
  const entityState = useEntityList({
    listSelector: (state: AppState) => state.item.items,
    fetchListAction: fetchItems,
  });

  return (
    <GenericListPage
      title="Items"
      entityState={entityState}
      columns={itemColumns}
      createRoute="/item/create"
      detailRouteBase="/item/detail"
      onRefresh={entityState.refresh}
      getKey={(item) => item.id}
    />
  );
};

export default List;
