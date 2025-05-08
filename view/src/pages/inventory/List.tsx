// src/pages/List.tsx
import React, { useEffect,useState } from "react";
import {
  fetchInventories,
  revaluateStock,
} from "../../store/slices/inventorySlice";
import { AppState,AppDispatch } from "../../store/store";
import {useSelector, useDispatch } from "react-redux";
import {useSearchParams} from "react-router-dom"
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const inventoryColumns = [
  { header: "Item", accessor: "item.name" },
  { header: "UoM", accessor: "item.uom.name" },
  { header: "MSL", accessor: "item.minimum_stock_level" },
  { header: "Balance", accessor: "balance" },
  { header: "Purchased Quantity", accessor: "purchased_quantity" },
  { header: "Consumed Quantity", accessor: "consumed_quantity" },
  { header: "Returned Quantity", accessor: "returned_quantity" },
];

const List: React.FC = () => {
 const { tokens } = useSelector((state: AppState) => state.auth);
     const [searchParams, setSearchParams] = useSearchParams();
     const [keyWord,setKeyWord]=useState("")
     const entityState = useSelector(
         (state: AppState) => state.inventory.inventories
       );
     const [params,setParams]=useState({
             search:searchParams.get("search") ||"",
             category:searchParams.get("category") ||"",
             type:searchParams.get("type") ||""
           })
      const dispatch = useDispatch<AppDispatch>();
  

      useEffect(() => {
        if (tokens) {
          dispatch(fetchInventories(params));
          // setSearchParams(params)
        }
      },[]);
      const handleRefresh = () => {
        dispatch(revaluateStock());
      };
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
      await dispatch(fetchInventories(parameters));
    
    }

  return (
    <GenericListPage
      title="Inventory"
      entityState={entityState}
      columns={inventoryColumns}
      hasDetail={false}
      detailRouteBase="/inventory/detail"
      onRefresh={handleRefresh}
      getKey={(inventory) => inventory.id}
      searchFilter={handleFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
