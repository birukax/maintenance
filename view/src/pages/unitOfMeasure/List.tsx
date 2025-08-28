// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import { fetchUnitOfMeasures } from "../../store/slices/unitOfMeasureSlice";
import { AppState, AppDispatch } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom"
import { type FetchParams } from '../../store/types';
import {
  GenericListPage,
} from "../../components/GenericListPage";

const unitOfMeasureColumns = [
  { header: "Code", accessor: "code" },
  { header: "Name", accessor: "name" },
];

const List: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyWord, setKeyWord] = useState("")
  const entityState = useSelector(
    (state: AppState) => state.unitOfMeasure.unitOfMeasures
  );
  const [params, setParams] = useState({
    search: searchParams.get("search") || "",
    page: searchParams.get("page") || 1
  })
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUnitOfMeasures(params));
  }, []);

  const handleRefresh = () => {
    dispatch(fetchUnitOfMeasures(params));
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
    await dispatch(fetchUnitOfMeasures(parameters));

  }

  return (
    <GenericListPage
      title="Unit of Measures"
      entityState={entityState}
      columns={unitOfMeasureColumns}
      createRoute="/unit-of-measure/create"
      detailRouteBase="/unit-of-measure/detail"
      onRefresh={handleRefresh}
      getKey={(unitOfMeasure) => unitOfMeasure.id}
      searchFilter={handleFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
