// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import { fetchWorkOrders } from "../../store/slices/workOrderSlice";
import { AppState, AppDispatch } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom"
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const workOrderColumns = [
  { header: 'ID', accessor: 'id' },
  { header: "Start Date", accessor: "start_date" },
  { header: "Status", accessor: "status" },
  { header: "Machine", accessor: "machine.name" },
  { header: "Equipment", accessor: "equipment.name" },
  { header: "Work Order Type", accessor: "work_order_type.name" },
  { header: "Activity Type", accessor: "activity_type.name" },
];

const List: React.FC = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyWord, setKeyWord] = useState("")
  const entityState = useSelector(
    (state: AppState) => state.workOrder.workOrders
  );
  const [params, setParams] = useState({
    search: searchParams.get("search") || "",
    page: searchParams.get("page") || 1
  })
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (tokens) {
      dispatch(fetchWorkOrders(params));
      // setSearchParams(params)
    }
  }, []);

  const handleRefresh = () => {
    if (tokens) {
      dispatch(fetchWorkOrders(params));
    }
  }

  const handleFilter = async (field, value) => {
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
    await dispatch(fetchWorkOrders(parameters));

  }

  return (
    <GenericListPage
      title="Work Order"
      entityState={{
        ...entityState
        // data: entityState.data?.filter((workOrder) => workOrder.work_order_type.scheduled === true),
      }}
      columns={workOrderColumns}
      createRoute="/work-order/create"
      detailRouteBase="/work-order/detail"
      onRefresh={handleRefresh}
      getKey={(workOrder) => workOrder.id}
      searchFilter={handleFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
