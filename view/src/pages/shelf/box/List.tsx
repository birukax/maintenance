// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import { fetchShelfBoxes } from "../../../store/slices/shelfBoxSlice";
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
  { header: "Location", accessor: "row.shelf.location.name" },
  { header: "Shelf", accessor: "row.shelf.name" },
  { header: "Row", accessor: "row.name" },
];


const List: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyWord, setKeyWord] = useState("")
  const entityState = useSelector(
    (state: AppState) => state.shelfBox.shelfBoxes
  );
  const [params, setParams] = useState({
    search: searchParams.get("search") || "",
    page: searchParams.get("page") || 1
  })
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchShelfBoxes(params));
  }, []);

  const handleRefresh = () => {
    dispatch(fetchShelfBoxes(params));
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
    await dispatch(fetchShelfBoxes(parameters));

  }

  return (
    <GenericListPage
      title="Shelf Boxes"
      entityState={entityState}
      columns={shelfColumns}
      createRoute="/shelf-box/create"
      detailRouteBase="/shelf-box/detail"
      onRefresh={handleRefresh}
      getKey={(shelfBox) => shelfBox.id}
      searchFilter={handleFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
