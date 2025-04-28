// src/pages/List.tsx
import React, { useEffect } from "react";
import {
  fetchInventories,
  revaluateStock,
} from "../../store/slices/inventorySlice";
import { AppState } from "../../store/store";
import { useDispatch } from "react-redux";
import { useEntityList } from "../../hooks/useEntityList";
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const inventoryColumns = [
  { header: "Item", accessor: "item.name" },
  { header: "UoM", accessor: "item.uom.name" },
  { header: "MSL", accessor: "item.minimum_stock_level" },
  { header: "Balance", accessor: "balance" },
  { header: "Purchased Quantity", accessor: "purchased_quantity" },
  { header: "Consumed Quantity", accessor: "consumed_quantity" },
  { header: "Returned Quantity", accessor: "returned_quantity" },
];

const List: React.FC = () => {
  const entityState = useEntityList({
    listSelector: (state: AppState) => state.inventory.inventories,
    fetchListAction: fetchInventories,
  });
  const dispatch = useDispatch();

  const handleRefresh = () => {
    dispatch(revaluateStock());
  };

  return (
    <GenericListPage
      title="Inventory"
      entityState={entityState}
      columns={inventoryColumns}
      hasDetail={false}
      detailRouteBase="/inventory/detail"
      onRefresh={handleRefresh}
      getKey={(inventory) => inventory.id}
    />
  );
};

export default List;
