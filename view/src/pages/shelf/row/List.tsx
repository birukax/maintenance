// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import { fetchShelfRows } from "../../../store/slices/shelfRowSlice";
import { AppState, AppDispatch } from "../../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom"
import {
  GenericListPage,
} from "../../../components/GenericListPage";
import { type FetchParams } from '../../../store/types';

const shelfColumns = [
  { header: "Code", accessor: "code" },
  { header: "Name", accessor: "name" },
  { header: "Location", accessor: "shelf.location.name" },
  { header: "Shelf", accessor: "shelf.name" },
];

const List: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyWord, setKeyWord] = useState("")
  const entityState = useSelector(
    (state: AppState) => state.shelfRow.shelfRows
  );
  const [params, setParams] = useState({
    search: searchParams.get("search") || "",
    page: searchParams.get("page") || 1
  })
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchShelfRows(params));
  }, []);

  const handleRefresh = () => {
    dispatch(fetchShelfRows(params));
  }
  const handleFilter = async (field: string, value: any) => {
    setParams(prev => {
      return {
        ...prev,
        [field]: value
      }
    })
    const parameters: FetchParams = {
      ...params,
      page: 1,
      [field]: value
    }
    setSearchParams({ ...parameters, [field]: value });
    await dispatch(fetchShelfRows(parameters));

  }

  return (
    <GenericListPage
      title="Shelf Rows"
      entityState={entityState}
      columns={shelfColumns}
      createRoute="/shelf-row/create"
      detailRouteBase="/shelf-row/detail"
      onRefresh={handleRefresh}
      getKey={(shelfRow) => shelfRow.id}
      searchFilter={handleFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
