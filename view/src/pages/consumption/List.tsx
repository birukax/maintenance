// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import { fetchConsumptions } from "../../store/slices/consumptionSlice";
import { AppState, AppDispatch } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom"
import {
  GenericListPage,
} from "../../components/GenericListPage";
import { FetchParams } from "../../store/types";

const consumptionColumns = [
  { header: "Item", accessor: "item.name" },
  { header: "Quantity", accessor: "quantity" },
  { header: "Date", accessor: "date" },
];

const List: React.FC = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyWord, setKeyWord] = useState("")
  const entityState = useSelector(
    (state: AppState) => state.consumption.consumptions
  );
  const [params, setParams] = useState<FetchParams>({
    search: searchParams.get("search") || "",
    page: searchParams.get("page") || 1
  })
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (tokens) {
      dispatch(fetchConsumptions(params));
      // setSearchParams(params)
    }
  }, []);

  const handleRefresh = () => {
    if (tokens) {
      dispatch(fetchConsumptions(params));
    }
  }

  const handleFilter = async (field: string, value: any) => {
    setSearchParams({ ...params, page: '1' });
    setParams(prev => {
      return {
        ...prev,
        [field]: value
      }
    })
    const parameters = {
      ...params, page: '1',
      [field]: value
    }
    setSearchParams({ ...parameters, [field]: value });
    await dispatch(fetchConsumptions(parameters));

  }

  return (
    <GenericListPage
      title="Consumptions"
      entityState={entityState}
      columns={consumptionColumns}
      createRoute="/consumption/create"
      detailRouteBase="/consumption/detail"
      onRefresh={handleRefresh}
      getKey={(consumption) => consumption.id}
      searchFilter={handleFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
