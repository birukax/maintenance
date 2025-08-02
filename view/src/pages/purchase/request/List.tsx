// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import { fetchPurchaseRequests } from "../../../store/slices/purchaseRequestSlice";
import { AppState, AppDispatch } from "../../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom"
import {
  GenericListPage,
} from "../../../components/GenericListPage";

const purchaseRequestColumns = [
  { header: "ID", accessor: "id" },
  { header: "Location", accessor: "location.name" },
  { header: "Requested By", accessor: "requested_by.username" },
  { header: "Requested Date", accessor: "requested_date" },
  { header: "Priority", accessor: "priority" },
  { header: "Status", accessor: "status" },
];

const List: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyWord, setKeyWord] = useState("")
  const entityState = useSelector(
    (state: AppState) => state.purchaseRequest.purchaseRequests
  );
  const [params, setParams] = useState({
    search: searchParams.get("search") || "",
    page: searchParams.get("page") || 1
  })
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchPurchaseRequests(params));

  }, []);

  const handleRefresh = () => {

    dispatch(fetchPurchaseRequests(params));
  }
  const handleFilter = async (field, value) => {
    setParams(prev => {
      return {
        ...prev,
        [field]: value
      }
    })
    const parameters = {
      ...params, page: 1,
      [field]: value
    }
    setSearchParams({ ...parameters, [field]: value });
    await dispatch(fetchPurchaseRequests(parameters));

  }
  return (
    <GenericListPage
      title="Purchase Requests"
      entityState={entityState}
      columns={purchaseRequestColumns}
      createRoute="/purchase-request/create"
      detailRouteBase="/purchase-request/detail"
      onRefresh={handleRefresh}
      getKey={(purchaseRequest) => purchaseRequest.id}
      searchFilter={handleFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
