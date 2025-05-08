// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import { fetchItems } from "../../store/slices/itemSlice";
import { AppState,AppDispatch } from "../../store/store";
import { useEntityList } from "../../hooks/useEntityList";
import {useSelector, useDispatch } from "react-redux";
import {useSearchParams} from "react-router-dom"
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const itemColumns = [
  { header: "ID", accessor: "no" },
  { header: "Name", accessor: "name" },
  { header: "UoM", accessor: "uom.name" },
  { header: "Type", accessor: "type" },
  { header: "Category", accessor: "category" },
];
const List: React.FC = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyWord,setKeyWord]=useState("")
  const entityState = useSelector(
      (state: AppState) => state.item.items
    );
  const [params,setParams]=useState({
    search:searchParams.get("search") ||"",
    category:searchParams.get("category") ||"",
    type:searchParams.get("type") ||""
  })
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
      if (tokens) {
        dispatch(fetchItems(params));
        // setSearchParams(params)
      }
    },[]);

    const handleRefresh = () => {
     if (tokens) {
       dispatch(fetchItems(params));
   }}

  const handleFilter=async (field,value)=>{
     setParams(prev=>{
      return{
        ...prev,
        [field]:value
      }
    })
    const parameters={
      ...params,
      [field]:value
    }
     setSearchParams({ ...params, [field]: value });
    await dispatch(fetchItems(parameters));
  
  }

  return (
    <GenericListPage
      title="Items"
      entityState={entityState}
      columns={itemColumns}
      createRoute="/item/create"
      detailRouteBase="/item/detail"
      onRefresh={handleRefresh}
      searchFilter={handleFilter}
      getKey={(item) => item.id}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
