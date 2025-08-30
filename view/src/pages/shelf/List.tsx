// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import { fetchShelves } from "../../store/slices/shelfSlice";
import { AppState, AppDispatch } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom"
import {
  GenericListPage,
} from "../../components/GenericListPage";
import { type FetchParams } from '../../store/types';

const shelfColumns = [
  { header: "Code", accessor: "code" },
  { header: "Name", accessor: "name" },
  { header: "Location", accessor: "location.name" },
];

const List: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyWord, setKeyWord] = useState("")
  const entityState = useSelector(
    (state: AppState) => state.shelf.shelves
  );
  const [params, setParams] = useState({
    search: searchParams.get("search") || "",
    page: searchParams.get("page") || 1
  })
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchShelves(params));
  }, []);

  const handleRefresh = () => {
    dispatch(fetchShelves(params));
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
      page: '1',
      [field]: value
    }
    setSearchParams({ ...parameters, [field]: value });
    await dispatch(fetchShelves(parameters));

  }

  return (
    <GenericListPage
      title="Shelves"
      entityState={entityState}
      columns={shelfColumns}
      createRoute="/shelf/create"
      detailRouteBase="/shelf/detail"
      onRefresh={handleRefresh}
      getKey={(shelf) => shelf.id}
      searchFilter={handleFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
