// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import { fetchActivityTypes } from "../../store/slices/activityTypeSlice";
import { useSelector, useDispatch } from "react-redux";
import { AppState, AppDispatch } from "../../store/store";
import { useSearchParams } from "react-router-dom";

import {
  GenericListPage,
} from "../../components/GenericListPage";

const activityTypeColumns = [
  { header: "Code", accessor: "code" },
  { header: "Name", accessor: "name" },
  { header: "Work Order Type", accessor: "work_order_type.name" },
];

const List: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyWord, setKeyWord] = useState("")
  const entityState = useSelector(
    (state: AppState) => state.activityType.activityTypes
  );

  const [params, setParams] = useState({
    search: searchParams.get("search") || "",
    page: searchParams.get("page") || 1
  })
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchActivityTypes(params));
    // setSearchParams(params)

  }, []);

  const handleRefresh = () => {
    dispatch(fetchActivityTypes(params));

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
      ...params,
      page: '1',
      [field]: value
    }
    setSearchParams({ ...parameters, [field]: value });
    await dispatch(fetchActivityTypes(parameters));

  }

  return (
    <GenericListPage
      title="Activity Types"
      entityState={entityState}
      columns={activityTypeColumns}
      createRoute="/activity-type/create"
      detailRouteBase="/activity-type/detail"
      onRefresh={handleRefresh}
      searchFilter={handleFilter}
      getKey={(activityType) => activityType.id}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
