// src/pages/List.tsx
import React, { useEffect,useState } from "react";
import { fetchWorkOrderTypes } from "../../store/slices/workOrderTypeSlice";
import { AppState,AppDispatch } from "../../store/store";
import {useSelector, useDispatch } from "react-redux";
import {useSearchParams} from "react-router-dom"
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const workOrderTypeColumns = [
  { header: "Code", accessor: "code" },
  { header: "Name", accessor: "name" },
  { header: "Scheduled", accessor: "scheduled" },
  { header: "Breakdown", accessor: "breakdown" },
];

const List: React.FC = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);
      const [searchParams, setSearchParams] = useSearchParams();
      const [keyWord,setKeyWord]=useState("")
      const entityState = useSelector(
          (state: AppState) => state.workOrderType.workOrderTypes
        );
      const [params,setParams]=useState({
        search:searchParams.get("search") ||"",
        category:searchParams.get("category") ||"",
        type:searchParams.get("type") ||""
      })
      const dispatch = useDispatch<AppDispatch>();
      
      useEffect(() => {
          if (tokens) {
            dispatch(fetchWorkOrderTypes(params));
            // setSearchParams(params)
          }
        },[]);
    
        const handleRefresh = () => {
         if (tokens) {
           dispatch(fetchWorkOrderTypes(params));
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
        await dispatch(fetchWorkOrderTypes(parameters));
      
      }
  
  return (
    <GenericListPage
      title="Work Order Types"
      entityState={entityState}
      columns={workOrderTypeColumns}
      createRoute="/work-order-type/create"
      detailRouteBase="/work-order-type/detail"
      onRefresh={entityState.refresh}
      getKey={(workOrderType) => workOrderType.id}
      searchFilter={handleFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
