// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import {
  fetchInventories,
  revaluateStock,
} from "../../store/slices/inventorySlice";
import { AppState, AppDispatch } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom"
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";
import api from '../../utils/api';
const inventoryColumns = [
  { header: "Item ID", accessor: "item.no" },
  { header: "Item", accessor: "item.name" },
  { header: "Location", accessor: "location.name" },
  { header: "UoM", accessor: "item.uom.name" },
  { header: "MSL", accessor: "item.minimum_stock_level" },
  { header: "Balance", accessor: "balance" },
  { header: "Purchased Quantity", accessor: "purchased" },
  { header: "Inbound Transfers", accessor: "inbound_transfers" },
  { header: "Outbound Transfers", accessor: "outbound_transfers" },
  // { header: "Consumed Quantity", accessor: "consumed_quantity" },
  // { header: "Returned Quantity", accessor: "returned_quantity" },
];

const List: React.FC = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyWord, setKeyWord] = useState("")
  const entityState = useSelector(
    (state: AppState) => state.inventory.inventories
  );
  const [params, setParams] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    type: searchParams.get("type") || "",
    page: searchParams.get("page") || 1
  })
  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
    if (tokens) {
      dispatch(fetchInventories(params));
      // setSearchParams(params)
    }
  }, []);

  const handleRefresh = () => {
    dispatch(fetchInventories(params));
  };
  const onDownload = {
    urlPath: '/inventory/inventories/download/',
    fileName: 'inventory.csv'
  }


  const handleFilter = async (field, value) => {
    setSearchParams({ ...params, page: 1 });
    setParams(prev => {
      return {
        ...prev,
        [field]: value
      }
    })
    const parameters = {
      ...params,
      page: 1,
      [field]: value
    }
    setSearchParams({ ...parameters, [field]: value });
    await dispatch(fetchInventories(parameters));

  }

  return (
    <GenericListPage
      title="Inventory"
      onDownload={onDownload}
      entityState={entityState}
      columns={inventoryColumns}
      hasDetail={false}
      detailRouteBase="/inventory/detail"
      onRefresh={handleRefresh}
      getKey={(inventory) => inventory.id}
      searchFilter={handleFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
