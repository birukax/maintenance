// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  fetchPurchaseSchedules,
  clear,
} from "../../store/slices/purchaseScheduleSlice";
import { AppState, AppDispatch } from "../../store/store";
import { GenericListPage } from "../../components/GenericListPage";
import { useSearchParams } from "react-router-dom";
import Edit from "./Edit";
import { useNavigate } from "react-router-dom";
const purchaseScheduleColumns = [
  { header: "Item ID", accessor: "item.no" },
  { header: "Item", accessor: "item.name" },
  { header: "UoM", accessor: "item.uom.name" },
  { header: "Current Balance", accessor: "balance" },
  { header: "Minimum Balance", accessor: "item.minimum_stock_level" },
  { header: "Year", accessor: "year.no" },
  { header: "Quantity", accessor: "quantity" },
  { header: "Purchased Quantity", accessor: "purchased_quantity" },
  { header: "January", accessor: "january" },
  { header: "February", accessor: "february" },
  { header: "March", accessor: "march" },
  { header: "April", accessor: "april" },
  { header: "May", accessor: "may" },
  { header: "June", accessor: "june" },
  { header: "July", accessor: "july" },
  { header: "August", accessor: "august" },
  { header: "September", accessor: "september" },
  { header: "October", accessor: "october" },
  { header: "November", accessor: "november" },
  { header: "December", accessor: "december" },
];
const List: React.FC = () => {
  const navigate = useNavigate();
  const { tokens } = useSelector((state: AppState) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [params, setParams] = useState({
    year__no: searchParams.get("year__no") && searchParams.get("year__no") !== "null" ? searchParams.get("year__no") : new Date().getFullYear(),
    page: searchParams.get("page") || 1

  });

  const [keyWord, setKeyWord] = useState("");
  const entityState = useSelector(
    (state: AppState) => state.purchaseSchedule.purchaseSchedules
  );
  const dispatch = useDispatch<AppDispatch>();
  // const [edit, setEdit] = useState(searchParams.get("edit") || false);

  useEffect(() => {
    dispatch(fetchPurchaseSchedules(params));
    setSearchParams(params);
  }, []);



  const handleRefresh = () => {
    if (tokens) {
      dispatch(fetchPurchaseSchedules(params));
    }
  };

  const handleEdit = async (year) => {
    // await dispatch(clear()).unwrap();
    navigate(`/purchase-schedule/edit/${year}?page=1`);
  };
  const handleFilter = async (field, value) => {
    let parameters
    // Handle filter action here
    if (field === "year__no") {
      if (!searchParams.get("search")) {
        parameters = {
          [field]: value
        }
      } else {
        parameters = {
          search: searchParams.get("search"),
          [field]: value,
        };
      }

      setSearchParams({ ...parameters });
      await dispatch(fetchPurchaseSchedules(parameters));
    }
  };
  const handleSearchFilter = async (field, value) => {
    // Handle filter action here
    const parameters = {
      year__no: searchParams.get("year__no"),
      page: 1,
      [field]: value,
    };


    setSearchParams({ ...parameters });

    await dispatch(fetchPurchaseSchedules(parameters));
  };


  return (
    <GenericListPage
      title="Purchase Schedules"
      entityState={entityState}
      columns={purchaseScheduleColumns}
      createRoute="/purchase-schedule/create"
      // detailRouteBase="/purchase-schedule/detail"
      hasDetail={false}
      onRefresh={handleRefresh}
      onEdit={handleEdit}
      yearFilter={handleFilter}
      getKey={(purchaseSchedule) => purchaseSchedule.id}
      searchFilter={handleSearchFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
