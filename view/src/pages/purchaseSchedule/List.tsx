// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchPurchaseSchedules } from "../../store/slices/purchaseScheduleSlice";
import { AppState, AppDispatch } from "../../store/store";
import { GenericListPage } from "../../components/GenericListPage";
import { useSearchParams } from "react-router-dom";
import Edit from "./Edit";

const purchaseScheduleColumns = [
  { header: "Item", accessor: "item.name" },
  { header: "UoM", accessor: "item.uom.name" },
  { header: "Balance", accessor: "item.inventory.balance" },
  { header: "Min Stock Level", accessor: "item.minimum_stock_level" },
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
  const { tokens } = useSelector((state: AppState) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyWord,setKeyWord]=useState("")
  const entityState = useSelector(
    (state: AppState) => state.purchaseSchedule.purchaseSchedules
  );
  const dispatch = useDispatch<AppDispatch>();
  const [params, setParams] = useState({
    year__no: searchParams.get("year__no") || new Date().getFullYear(),
    search:searchParams.get("search") ||"",
  });
  const [edit, setEdit] = useState(searchParams.get("edit") || false);

  useEffect(() => {
    if (tokens) {
      dispatch(fetchPurchaseSchedules(params));
      setSearchParams(params)
    }
  },[]);

  const handleRefresh = () => {
  if (tokens) {
    dispatch(fetchPurchaseSchedules(params));
}}

  const handleEdit = () => {
    // setSearchParams({year: searchParams.get('year'), edit: "true"});
    const currentParams = Object.fromEntries(searchParams.entries());

    setEdit(true);
    setSearchParams({ ...currentParams, edit: true });
  };
  const handleFilter = async (field, value) => {
    // Handle filter action here
    if (field === "year__no") {
      const parameters = {
        search:searchParams.get("search"),
        [field]: value,
      };
      console.log("changed year",parameters);

      setSearchParams({...parameters});

      console.log("serac",searchParams.get("year__no"));
      
      await dispatch(fetchPurchaseSchedules(parameters));
    }
  };
  const handleSearchFilter = async (field, value) => {
    // Handle filter action here
      const parameters = {
        year__no:searchParams.get("year__no"),
        [field]: value,
      };

      console.log("changed year",parameters);
      
       setSearchParams({...parameters});

      await dispatch(fetchPurchaseSchedules(parameters));
  };

  if (!edit) {
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
  } else {
    return <Edit params={params} setEdit={setEdit} />;
  }
};

export default List;
