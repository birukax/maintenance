// src/pages/List.tsx
import React, { useEffect,useState } from "react";
import { fetchShelfRows } from "../../store/slices/shelfRowSlice";
import { AppState,AppDispatch } from "../../store/store";
import {useSelector, useDispatch } from "react-redux";
import {useSearchParams} from "react-router-dom"
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const shelfColumns = [
  { header: "Code", accessor: "code" },
  { header: "Name", accessor: "name" },
];

const List: React.FC = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);
      const [searchParams, setSearchParams] = useSearchParams();
      const [keyWord,setKeyWord]=useState("")
      const entityState = useSelector(
          (state: AppState) => state.shelfRow.shelfRows
        );
      const [params,setParams]=useState({
        search:searchParams.get("search") ||"",
 page:searchParams.get("page")||1       
      })
      const dispatch = useDispatch<AppDispatch>();
      
      useEffect(() => {
          if (tokens) {
            dispatch(fetchShelfRows(params));
            // setSearchParams(params)
          }
        },[]);
    
        const handleRefresh = () => {
         if (tokens) {
           dispatch(fetchShelfRows(params));
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
          page:1,
          [field]:value
        }
         setSearchParams({ ...parameters, [field]: value });
        await dispatch(fetchShelfRows(parameters));
      
      }

  return (
    <GenericListPage
      title="Shelf Rows"
      entityState={entityState}
      columns={shelfColumns}
      createRoute="/shelf-row/create"
      detailRouteBase="/shelf-row/detail"
      onRefresh={handleRefresh}
      getKey={(shelfRow) => shelfRow.id}
      searchFilter={handleFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
