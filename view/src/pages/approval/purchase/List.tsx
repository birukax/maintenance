// src/pages/List.tsx
import React, { useEffect ,useState} from "react";
import {
  fetchPurchaseApprovals,
  approvePurchaseApproval,
  rejectPurchaseApproval,
} from "../../../store/slices/purchaseApprovalSlice";
import { AppState, AppDispatch } from "../../../store/store";
import {useSelector, useDispatch } from "react-redux";
import {useSearchParams} from "react-router-dom"
import { useEntityList } from "../../../hooks/useEntityList";
import { GenericListPage } from "../../../components/GenericListPage";

import { toast } from "react-toastify";

const purchaseApprovalColumns = [
  { header: "Item", accessor: "purchase_request.item.name" },
  { header: "UoM", accessor: "purchase_request.item.uom.code" },
  { header: "Quantity", accessor: "purchase_request.quantity" },
  {
    header: "Requested By",
    accessor: "purchase_request.requested_by.username",
  },
  { header: "Priority", accessor: "purchase_request.priority" },
  { header: "Status", accessor: "status" },
];
const List: React.FC = () => {
  const entityState = useSelector(
        (state: AppState) => state.purchaseApproval.purchaseApprovals
      );
      const [handlers, setHandlers] = React.useState(false);
      const { tokens } = useSelector((state: AppState) => state.auth);
        const [searchParams, setSearchParams] = useSearchParams();
        const [keyWord,setKeyWord]=useState("")
        const [params,setParams]=useState({
            search:searchParams.get("search") ||"",
            category:searchParams.get("category") ||"",
            type:searchParams.get("type") ||"",
            page:searchParams.get("page") ||1
          })
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
        if (tokens) {
          dispatch(fetchPurchaseApprovals(params));
          // setSearchParams(params)
        }
      },[]);


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
          await dispatch(fetchPurchaseApprovals(parameters));
        
        }

  const handleApprove = async (id) => {
    await dispatch(approvePurchaseApproval(id)).unwrap();
    toast.success("Purchase Approved");
    dispatch(fetchPurchaseApprovals());
    // setHandlers((prev) => !prev);
    handleRefresh();
  };

  const handleReject = async (id) => {
    await dispatch(rejectPurchaseApproval(id)).unwrap();
    toast.success("Purchase Rejected");
    dispatch(fetchPurchaseApprovals());
    // setHandlers((prev) => !prev);
    handleRefresh();
  };

  const handleRefresh = () => {
    dispatch(fetchPurchaseApprovals()).unwrap();
  };
  


  return (
    <GenericListPage
      title="Purchase Approval"
      entityState={entityState}
      columns={purchaseApprovalColumns}
      onRefresh={handleRefresh}
      searchFilter={handleFilter}
      hasDetail={false}
      hasApproval={true}
      onApprove={(id) => handleApprove(id)}
      onReject={(id) => handleReject(id)}
      getKey={(purchaseApproval) => purchaseApproval.id}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
