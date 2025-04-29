// src/pages/List.tsx
import React, { useEffect } from "react";
import { fetchPurchaseSchedules } from "../../store/slices/purchaseScheduleSlice";
import { AppState } from "../../store/store";
import { useEntityList } from "../../hooks/useEntityList";
import { MONTH_NAMES } from "../../utils/choices";
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";
import { useSearchParams } from "react-router-dom";
import Edit from "./Edit";

const purchaseScheduleColumns = [
  { header: "Item", accessor: "item.name" },
  { header: "UoM", accessor: "item.uom.name" },
  { header: "Balance", accessor: "item.inventory.balance" },
  { header: "Min Stock Level", accessor: "item.minimum_stock_level" },
  { header: "Year", accessor: "year" },
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
  const entityState = useEntityList({
    listSelector: (state: AppState) => state.purchaseSchedule.purchaseSchedules,
    fetchListAction: fetchPurchaseSchedules,
  });
  
  const [searchParams, setSearchParams] = useSearchParams()
  const handleEdit=()=>{
    // Handle edit action here
    
    setSearchParams({ edit: "true" });
  }
  const handleFillter=(value)=>{
    // Handle filter action here
    setSearchParams({ year: value });
    console.log(value);
    
  }

if(!searchParams.get("edit")){
  return (
    
    <GenericListPage
      title="Purchase Schedules"
      entityState={entityState}
      columns={purchaseScheduleColumns}
      createRoute="/purchase-schedule/create"
      // detailRouteBase="/purchase-schedule/detail"
      hasDetail={false}
      onRefresh={entityState.refresh}
      onEdit={handleEdit}
      fillter={handleFillter}
      getKey={(purchaseSchedule) => purchaseSchedule.id}
    />
  );
}else{
  return(

   <Edit/>
  )
}
};

export default List;
