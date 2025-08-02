// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import { fetchEquipments } from "../../store/slices/equipmentSlice";
import { AppState, AppDispatch } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom"
import {
  GenericListPage,
} from "../../components/GenericListPage";

const equipmentColumns = [
  { header: "Code", accessor: "code" },
  { header: "Name", accessor: "name" },
  { header: "machine", accessor: "machine.name" },
];

const List: React.FC = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyWord, setKeyWord] = useState("")
  const entityState = useSelector(
    (state: AppState) => state.equipment.equipments
  );
  const [params, setParams] = useState({
    search: searchParams.get("search") || "",
    page: searchParams.get("page") || 1
  })
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (tokens) {
      dispatch(fetchEquipments(params));
      // setSearchParams(params)
    }
  }, []);

  const handleRefresh = () => {
    if (tokens) {
      dispatch(fetchEquipments(params));
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
      ...params, page: 1,
      [field]: value
    }
    setSearchParams({ ...parameters, [field]: value });
    await dispatch(fetchEquipments(parameters));

  }
  return (
    <GenericListPage
      title="Equipments"
      entityState={entityState}
      columns={equipmentColumns}
      createRoute="/equipment/create"
      detailRouteBase="/equipment/detail"
      onRefresh={handleRefresh}
      getKey={(equipment) => equipment.id}
      searchFilter={handleFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
