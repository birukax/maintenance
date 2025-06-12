// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import { fetchItems } from "../../store/slices/itemSlice";
import { AppState,AppDispatch } from "../../store/store";
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
  { header: "Location", accessor: "shelf.location?.name" },
  { header: "Shelf", accessor: "shelf.name" },
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
    type:searchParams.get("type") ||"",
    page:searchParams.get("page") || 1
  })
  const dispatch = useDispatch<AppDispatch>();
  console.log(entityState);
  
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
    setSearchParams({ ...params});
     setParams(prev=>{
      return{
        ...prev,
        [field]:value
      }
    })
    const parameters={
      ...params,
      page: 1,
      [field]:value
    }
     setSearchParams({ ...parameters, [field]: value });
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
      getKey={(item) => item.id}
      searchFilter={handleFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
