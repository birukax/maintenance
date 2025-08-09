// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import { fetchClearances } from "../../store/slices/clearanceSlice";
import { AppState, AppDispatch } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { GenericListPage } from "../../components/GenericListPage";

const contactColumns = [
  { header: "Description", accessor: "description" },
  { header: "Active", accessor: "active" },
  { header: "Breakdown", accessor: "breakdown" },
  { header: "Scheduled", accessor: "scheduled" },
];

const List: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyWord, setKeyWord] = useState("")
  const entityState = useSelector(
    (state: AppState) => state.clearance.clearances
  );
  const [params, setParams] = useState({
    search: searchParams.get("search") || "",
    page: searchParams.get("page") || 1
  })
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchClearances(params));
  }, []);

  const handleRefresh = () => {
    dispatch(fetchClearances(params));
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
      ...params, page: 1,
      [field]: value
    }
    setSearchParams({ ...parameters, [field]: value });
    await dispatch(fetchClearances(parameters));

  }

  return (
    <GenericListPage
      title="Clearances"
      entityState={entityState}
      columns={contactColumns}
      createRoute="/clearance/create"
      detailRouteBase="/clearance/detail"
      onRefresh={handleRefresh}
      getKey={(clearance) => clearance.id}
      searchFilter={handleFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
