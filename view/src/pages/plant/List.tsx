// src/pages/List.tsx
import React, { useEffect,useState } from "react";
import { fetchPlants } from "../../store/slices/plantSlice";
import { AppState,AppDispatch } from "../../store/store";
import {useSelector, useDispatch } from "react-redux";
import {useSearchParams} from "react-router-dom"
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const plantColumns = [
  { header: "Code", accessor: "code" },
  { header: "Name", accessor: "name" },
];

const List: React.FC = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);
      const [searchParams, setSearchParams] = useSearchParams();
      const [keyWord,setKeyWord]=useState("")
      const entityState = useSelector(
          (state: AppState) => state.plant.plants
        );
      const [params,setParams]=useState({
        search:searchParams.get("search") ||"",
        category:searchParams.get("category") ||"",
        type:searchParams.get("type") ||""
      })
      const dispatch = useDispatch<AppDispatch>();
      
      useEffect(() => {
          if (tokens) {
            dispatch(fetchPlants(params));
            // setSearchParams(params)
          }
        },[]);
    
        const handleRefresh = () => {
         if (tokens) {
           dispatch(fetchPlants(params));
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
        await dispatch(fetchPlants(parameters));
      
      }

  return (
    <GenericListPage
      title="Plants"
      entityState={entityState}
      columns={plantColumns}
      createRoute="/plant/create"
      detailRouteBase="/plant/detail"
      onRefresh={handleRefresh}
      getKey={(plant) => plant.id}
      searchFilter={handleFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
