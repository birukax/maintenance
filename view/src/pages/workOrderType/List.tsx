// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import { fetchWorkOrderTypes } from "../../store/slices/workOrderTypeSlice";
import { AppState, AppDispatch } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom"
import { type Data, type FetchParams } from '../../store/types';
import {
  GenericListPage,
} from "../../components/GenericListPage";

const workOrderTypeColumns = [
  { header: "Code", accessor: "code" },
  { header: "Name", accessor: "name" },
  { header: "Scheduled", accessor: "scheduled" },
  { header: "Breakdown", accessor: "breakdown" },
];

const List: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyWord, setKeyWord] = useState("")
  const entityState = useSelector(
    (state: AppState) => state.workOrderType.workOrderTypes
  );
  const [params, setParams] = useState({
    search: searchParams.get("search") || "",
    page: searchParams.get("page") || 1
  })
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchWorkOrderTypes(params));
  }, []);

  const handleRefresh = () => {
    dispatch(fetchWorkOrderTypes(params));
  }

  const handleFilter = async (field: string, value: any) => {
    setParams(prev => {
      return {
        ...prev,
        [field]: value
      }
    })
    const parameters: FetchParams = {
      ...params, page: 1,
      [field]: value
    }
    setSearchParams({ ...parameters, [field]: value });
    await dispatch(fetchWorkOrderTypes(parameters));

  }

  return (
    <GenericListPage
      onEdit=''
      onDownload=''
      yearFilter=''
      title="Work Order Types"
      entityState={entityState}
      columns={workOrderTypeColumns}
      createRoute="/work-order-type/create"
      detailRouteBase="/work-order-type/detail"
      onRefresh={handleRefresh}
      getKey={(workOrderType: Data) => workOrderType.id}
      searchFilter={handleFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
