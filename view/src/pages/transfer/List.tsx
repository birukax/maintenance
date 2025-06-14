// src/pages/List.tsx
import React, { useEffect,useState } from "react";
import { fetchTransfers } from "../../store/slices/transferSlice";
import { AppState,AppDispatch } from "../../store/store";
import {useSelector, useDispatch } from "react-redux";
import {useSearchParams} from "react-router-dom"
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const transferColumns = [
  { header: "Requestor", accessor: "requested_by.username"},
  { header: "Requested Date", accessor: "requested_date"},
  { header: "Status", accessor: "status"},
  { header: "From", accessor: "from_location.name"},
  { header: "To", accessor: "to_location.name"}
];

const List: React.FC = () => {
   const { tokens } = useSelector((state: AppState) => state.auth);
      const [searchParams, setSearchParams] = useSearchParams();
      const [keyWord,setKeyWord]=useState("")
      const entityState = useSelector(
          (state: AppState) => state.transfer.transfers
        );
      const [params,setParams]=useState({
        search:searchParams.get("search") ||"",
 page:searchParams.get("page")||1       
      })
      const dispatch = useDispatch<AppDispatch>();
      
      useEffect(() => {
          if (tokens) {
            dispatch(fetchTransfers(params));
            // setSearchParams(params)
          }
        },[]);
    
        const handleRefresh = () => {
         if (tokens) {
           dispatch(fetchTransfers(params));
       }}
    
      const handleFilter=async (field,value)=>{
         setParams(prev=>{
          return{
            ...prev,
            [field]:value
          }
        })
        const parameters={
          ...params,page:1,
          [field]:value
        }
         setSearchParams({ ...parameters, [field]: value });
        await dispatch(fetchTransfers(parameters));
      
      }
  
  return (
    <GenericListPage
      title="Transfer"
      entityState={{
        ...entityState
        // data: entityState.data?.filter((transfer) => transfer.work_order_type.scheduled === true),
      }}
      columns={transferColumns}
      createRoute="/transfer/create"
      detailRouteBase="/transfer/detail"
      onRefresh={handleRefresh}
      getKey={(transfer) => transfer.id}
      searchFilter={handleFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
