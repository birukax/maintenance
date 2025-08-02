// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import { fetchAreas } from "../../store/slices/areaSlice";
import { AppState, AppDispatch } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom"
import {
  GenericListPage,
} from "../../components/GenericListPage";

const areaColumns = [
  { header: "Code", accessor: "code" },
  { header: "Name", accessor: "name" },
  { header: "Plant", accessor: "plant.name" },
];

const List: React.FC = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyWord, setKeyWord] = useState("")
  const entityState = useSelector(
    (state: AppState) => state.area.areas
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
      dispatch(fetchAreas(params));
      // setSearchParams(params)
    }
  }, []);

  const handleRefresh = () => {
    if (tokens) {
      dispatch(fetchAreas(params));
    }
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
    await dispatch(fetchAreas(parameters));

  }

  return (
    <GenericListPage
      title="Areas"
      entityState={entityState}
      columns={areaColumns}
      createRoute="/area/create"
      detailRouteBase="/area/detail"
      onRefresh={handleRefresh}
      getKey={(area) => area.id}
      searchFilter={handleFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
