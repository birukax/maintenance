// src/pages/List.tsx
import React, { useEffect,useState } from "react";
import { fetchMachines } from "../../store/slices/machineSlice";
import { AppState,AppDispatch } from "../../store/store";
import {useSelector, useDispatch } from "react-redux";
import {useSearchParams} from "react-router-dom"
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const machineColumns = [
  { header: "Code", accessor: "code" },
  { header: "Name", accessor: "name" },
  { header: "area", accessor: "area.name" },
];

const List: React.FC = () => {
 const { tokens } = useSelector((state: AppState) => state.auth);
     const [searchParams, setSearchParams] = useSearchParams();
     const [keyWord,setKeyWord]=useState("")
     const entityState = useSelector(
         (state: AppState) => state.machine.machines
       );
     const [params,setParams]=useState({
       search:searchParams.get("search") ||"",
       category:searchParams.get("category") ||"",
       type:searchParams.get("type") ||""
     })
     const dispatch = useDispatch<AppDispatch>();
     
     useEffect(() => {
         if (tokens) {
           dispatch(fetchMachines(params));
           // setSearchParams(params)
         }
       },[]);
   
       const handleRefresh = () => {
        if (tokens) {
          dispatch(fetchMachines(params));
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
       await dispatch(fetchMachines(parameters));
     
     }
  return (
    <GenericListPage
      title="Machines"
      entityState={entityState}
      columns={machineColumns}
      createRoute="/machine/create"
      detailRouteBase="/machine/detail"
      onRefresh={handleRefresh}
      getKey={(machine) => machine.id}
      searchFilter={handleFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
