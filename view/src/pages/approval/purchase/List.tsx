// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import {
  fetchPurchaseApprovals,
} from "../../../store/slices/purchaseApprovalSlice";
import { AppState, AppDispatch } from "../../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { GenericListPage } from "../../../components/GenericListPage";
const purchaseApprovalColumns = [
  { header: "Purchase ID", accessor: "id" },
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyWord, setKeyWord] = useState("")
  const [params, setParams] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    type: searchParams.get("type") || "",
    page: searchParams.get("page") || 1
  })
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchPurchaseApprovals(params));
    // setSearchParams(params)
  }, []);


  const handleFilter = async (field: string, value: any) => {
    setSearchParams({ ...params, page: 1 });

    setParams(prev => {
      return {
        ...prev,
        [field]: value
      }
    })
    const parameters = {
      ...params,
      page: 1,
      [field]: value
    }
    setSearchParams({ ...parameters, [field]: value });
    await dispatch(fetchPurchaseApprovals(parameters));

  }

  const handleRefresh = () => {
    dispatch(fetchPurchaseApprovals(params));
  };



  return (
    <GenericListPage
      title="Purchase Approval"
      entityState={entityState}
      columns={purchaseApprovalColumns}
      onRefresh={handleRefresh}
      searchFilter={handleFilter}
      detailRouteBase='/purchase/approval/detail'
      getKey={(purchaseApproval) => purchaseApproval.id}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
