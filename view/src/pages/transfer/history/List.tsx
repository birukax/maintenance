// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import { fetchTransferHistories } from "../../../store/slices/transferSlice";
import { AppState, AppDispatch } from "../../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom"
import { GenericListPage } from "../../../components/GenericListPage";
import { type FetchParams } from '../../../store/types';

const transferColumns = [
  { header: "No", accessor: "item.no" },
  { header: "Item", accessor: "item.name" },
  { header: "Location", accessor: "location.name" },
  { header: "Type", accessor: "type" },
  { header: "Completed", accessor: "completed" }
];

const List: React.FC = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyWord, setKeyWord] = useState("")
  const entityState = useSelector(
    (state: AppState) => state.transfer.transferHistories
  );
  const [params, setParams] = useState({
    search: searchParams.get("search") || "",
    page: searchParams.get("page") || 1
  })
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (tokens) {
      dispatch(fetchTransferHistories(params));
      // setSearchParams(params)
    }
  }, []);

  const handleRefresh = () => {
    if (tokens) {
      dispatch(fetchTransferHistories(params));
    }
  }

  const handleFilter = async (field: string, value: any) => {
    setParams(prev => {
      return {
        ...prev,
        [field]: value
      }
    })
    const parameters: FetchParams = {
      ...params, page: '1',
      [field]: value
    }
    setSearchParams({ ...parameters, [field]: value });
    await dispatch(fetchTransferHistories(parameters));

  }
  return (
    <GenericListPage
      title="Transfer History"
      entityState={{
        ...entityState
        // data: entityState.data?.filter((transfer) => transfer.work_order_type.scheduled === true),
      }}
      hasDetail={false}
      columns={transferColumns}
      onRefresh={handleRefresh}
      getKey={(transfer) => transfer.id}
      searchFilter={handleFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}

    />
  );
};

export default List;
