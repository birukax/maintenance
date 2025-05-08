// src/pages/List.tsx
import React, { useEffect,useState} from "react";
import { fetchBreakdowns } from "../../store/slices/breakdownSlice";
import { AppState,AppDispatch } from "../../store/store";
import {useSelector, useDispatch } from "react-redux";
import {useSearchParams} from "react-router-dom"
import { GenericListPage } from "../../components/GenericListPage";

const breakdownColumns = [
  { header: "Machine", accessor: "machine.name" },
  { header: "Equipment", accessor: "equipment.name" },
  { header: "Start Date", accessor: "start_date" },
  { header: "Start Time (h:m:S)", accessor: "start_time" },
  // { header: "Planned Time (s)", accessor: "planned_time" },
];

const List: React.FC = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);
      const [searchParams, setSearchParams] = useSearchParams();
      const [keyWord,setKeyWord]=useState("")
      const entityState = useSelector(
          (state: AppState) => state.breakdown.breakdowns
        );
      const [params,setParams]=useState({
        search:searchParams.get("search") ||"",
        
      })

      const dispatch = useDispatch<AppDispatch>();
          
          useEffect(() => {
              if (tokens) {
                dispatch(fetchBreakdowns(params));
                // setSearchParams(params)
              }
            },[]);
        
            const handleRefresh = () => {
             if (tokens) {
               dispatch(fetchBreakdowns(params));
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
            await dispatch(fetchBreakdowns(parameters));
          
          }

  return (
    <GenericListPage
      title="Breakdown"
      entityState={entityState}
      columns={breakdownColumns}
      createRoute="/breakdown/create"
      detailRouteBase="/breakdown/detail"
      onRefresh={handleRefresh}
      getKey={(breakdown) => breakdown.id}
      searchFilter={handleFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
