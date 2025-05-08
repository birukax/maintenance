// src/pages/List.tsx
import React, { useEffect,useState } from "react";
import { fetchPurchaseRequests } from "../../store/slices/purchaseRequestSlice";
import { AppState,AppDispatch } from "../../store/store";
import {useSelector, useDispatch } from "react-redux";
import {useSearchParams} from "react-router-dom"
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const purchaseRequestColumns = [
  { header: "Item", accessor: "item.name" },
  { header: "Quantity", accessor: "quantity" },
  { header: "Requested Date", accessor: "requested_date" },
  { header: "Priority", accessor: "priority" },
  { header: "Status", accessor: "status" },
];

const List: React.FC = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);
      const [searchParams, setSearchParams] = useSearchParams();
      const [keyWord,setKeyWord]=useState("")
      const entityState = useSelector(
          (state: AppState) => state.purchaseRequest.purchaseRequests
        );
      const [params,setParams]=useState({
        search:searchParams.get("search") ||"",
        category:searchParams.get("category") ||"",
        type:searchParams.get("type") ||""
      })
      const dispatch = useDispatch<AppDispatch>();
      
      useEffect(() => {
          if (tokens) {
            dispatch(fetchPurchaseRequests(params));
            // setSearchParams(params)
          }
        },[]);
    
        const handleRefresh = () => {
         if (tokens) {
           dispatch(fetchPurchaseRequests(params));
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
        await dispatch(fetchPurchaseRequests(parameters));
      
      }
  return (
    <GenericListPage
      title="Purchase Requests"
      entityState={entityState}
      columns={purchaseRequestColumns}
      createRoute="/purchase-request/create"
      detailRouteBase="/purchase-request/detail"
      onRefresh={entityState.refresh}
      getKey={(purchaseRequest) => purchaseRequest.id}
      searchFilter={handleFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
