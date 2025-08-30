// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import { fetchLocations } from "../../store/slices/locationSlice";
import { AppState, AppDispatch } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom"
import {
  GenericListPage,
} from "../../components/GenericListPage";
import { FetchParams } from "../../store/types";

const locationColumns = [
  { header: "Code", accessor: "code" },
  { header: "Name", accessor: "name" },
];

const List: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyWord, setKeyWord] = useState("")
  const entityState = useSelector(
    (state: AppState) => state.location.locations
  );
  const [params, setParams] = useState({
    search: searchParams.get("search") || "",
    page: searchParams.get("page") || 1
  })
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchLocations(params));
  }, []);

  const handleRefresh = () => {
    dispatch(fetchLocations(params));

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
    await dispatch(fetchLocations(parameters));

  }

  return (
    <GenericListPage
      title="Locations"
      entityState={entityState}
      columns={locationColumns}
      createRoute="/location/create"
      detailRouteBase="/location/detail"
      onRefresh={handleRefresh}
      getKey={(location) => location.id}
      searchFilter={handleFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
