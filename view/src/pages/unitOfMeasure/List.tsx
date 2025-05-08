// src/pages/List.tsx
import React, { useEffect,useState } from "react";
import { fetchUnitOfMeasures } from "../../store/slices/unitOfMeasureSlice";
import { AppState,AppDispatch } from "../../store/store";
import {useSelector, useDispatch } from "react-redux";
import {useSearchParams} from "react-router-dom"
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const unitOfMeasureColumns = [
  { header: "Code", accessor: "code" },
  { header: "Name", accessor: "name" },
];

const List: React.FC = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);
      const [searchParams, setSearchParams] = useSearchParams();
      const [keyWord,setKeyWord]=useState("")
      const entityState = useSelector(
          (state: AppState) => state.unitOfMeasure.unitOfMeasures
        );
      const [params,setParams]=useState({
        search:searchParams.get("search") ||"",
        
      })
      const dispatch = useDispatch<AppDispatch>();
      
      useEffect(() => {
          if (tokens) {
            dispatch(fetchUnitOfMeasures(params));
            // setSearchParams(params)
          }
        },[]);
    
        const handleRefresh = () => {
         if (tokens) {
           dispatch(fetchUnitOfMeasures(params));
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
