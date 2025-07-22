// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import { fetchSchedules } from "../../store/slices/scheduleSlice";
import { AppState, AppDispatch } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom"
import { GenericListPage } from "../../components/GenericListPage";

const scheduleColumns = [
  { header: 'ID', accessor: 'id' },
  { header: "Type", accessor: "type" },
  { header: "Machine", accessor: "machine.name" },
  { header: "Equipment", accessor: "equipment.name" },
  { header: "Work Order Type", accessor: "work_order_type.name" },
  { header: 'Total Work Orders', accessor: 'total_work_orders' },
  { header: "Activity Type", accessor: "activity_type.name" },
  { header: "Planned Time (h:m:s)", accessor: "planned_time" },
];

const List: React.FC = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyWord, setKeyWord] = useState("")
  const entityState = useSelector(
    (state: AppState) => state.schedule.schedules
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
      dispatch(fetchSchedules(params));
      // setSearchParams(params)
    }
  }, []);

  const handleRefresh = () => {
    if (tokens) {
      dispatch(fetchSchedules(params));
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
    await dispatch(fetchSchedules(parameters));

  }

  return (
    <GenericListPage
      title="Schedule"
      entityState={entityState}
      columns={scheduleColumns}
      createRoute="/schedule/create"
      detailRouteBase="/schedule/detail"
      onRefresh={handleRefresh}
      getKey={(schedule) => schedule.id}
      searchFilter={handleFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
