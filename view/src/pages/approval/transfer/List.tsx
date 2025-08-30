// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import {
  fetchTransferApprovals,
} from "../../../store/slices/transferApprovalSlice";
import { AppState, AppDispatch } from "../../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { GenericListPage } from "../../../components/GenericListPage";
const transferApprovalColumns = [
  { header: "Transfer ID", accessor: "transfer.id" },
  {
    header: "Requested By",
    accessor: "transfer.requested_by.username",
  },
  { header: "Status", accessor: "status" },
];
const List: React.FC = () => {
  const entityState = useSelector(
    (state: AppState) => state.transferApproval.transferApprovals
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
    dispatch(fetchTransferApprovals(params));
  }, []);


  const handleFilter = async (field: string, value: any) => {
    setSearchParams({ ...params, page: '1' });

    setParams(prev => {
      return {
        ...prev,
        [field]: value
      }
    })
    const parameters = {
      ...params,
      page: '1',
      [field]: value
    }
    setSearchParams({ ...parameters, [field]: value });
    await dispatch(fetchTransferApprovals(parameters));

  }

  const handleRefresh = () => {
    dispatch(fetchTransferApprovals(params));
  };



  return (
    <GenericListPage
      title="Transfer Approval"
      entityState={entityState}
      columns={transferApprovalColumns}
      onRefresh={handleRefresh}
      searchFilter={handleFilter}
      detailRouteBase='/transfer/approval/detail'
      getKey={(transferApproval) => transferApproval.id}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
