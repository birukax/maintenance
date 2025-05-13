// src/pages/List.tsx
import React, { useEffect,useState } from "react";
import { fetchActivities } from "../../store/slices/activitySlice";
import { AppState,AppDispatch } from "../../store/store";
import { GenericListPage } from "../../components/GenericListPage";
import {useSelector, useDispatch } from "react-redux";
import {useSearchParams} from "react-router-dom"

const activityColumns = [
  { header: "Code", accessor: "code" },
  { header: "Activity Name", accessor: "name" },
  { header: "Activity Type", accessor: "activity_type.name" },
];

const List: React.FC = () => {

  const { tokens } = useSelector((state: AppState) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyWord,setKeyWord]=useState("")
  const entityState = useSelector(
    (state: AppState) => state.activity.activities
  );

  const [params,setParams]=useState({
      search:searchParams.get("search") ||"",
      page:searchParams.get("page") || 1
    })
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
        if (tokens) {
          dispatch(fetchActivities(params));
        }
      },[]);
  
      const handleRefresh = () => {
       if (tokens) {
         dispatch(fetchActivities(params));
     }}

  const handleFilter=async (field,value)=>{
       setSearchParams({ ...params, page: 1 });
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
      await dispatch(fetchActivities(parameters));
    
    }
  return (
    <GenericListPage
      title="Activity"
      entityState={entityState}
      columns={activityColumns}
      createRoute="/activity/create"
      detailRouteBase="/activity/detail"
      onRefresh={handleRefresh}
      searchFilter={handleFilter}
      getKey={(activity) => activity.id}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
