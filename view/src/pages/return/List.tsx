// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import { fetchReturns } from "../../store/slices/returnSlice";
import { AppState, AppDispatch } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom"
import {
  GenericListPage,
} from "../../components/GenericListPage";
import { type FetchParams } from "../../store/types";

const returnColumns = [
  { header: "Item", accessor: "item.name" },
  { header: "UoM", accessor: "item.uom.name" },
  { header: "Quantity", accessor: "quantity" },
  { header: "Date", accessor: "date" },
];

const List: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyWord, setKeyWord] = useState("")
  const entityState = useSelector(
    (state: AppState) => state.return.returns
  );
  const [params, setParams] = useState({
    search: searchParams.get("search") || "",
    page: searchParams.get("page") || 1
  })
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchReturns(params));

  }, []);

  const handleRefresh = () => {
    dispatch(fetchReturns(params));
  }


  const handleFilter = async (field: string, value: any) => {
    setParams(prev => {
      return {
        ...prev,
        [field]: value
      }
    })
    const parameters: FetchParams = {
      ...params, page: '1',
      [field]: value
    }
    setSearchParams({ ...parameters, [field]: value });
    await dispatch(fetchReturns(parameters));

  }

  return (
    <GenericListPage
      title="Returns"
      entityState={entityState}
      columns={returnColumns}
      createRoute="/return/create"
      detailRouteBase="/return/detail"
      onRefresh={handleRefresh}
      getKey={(ret) => ret.id}
      searchFilter={handleFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
