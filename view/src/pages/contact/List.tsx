// src/pages/List.tsx
import React, { useEffect,useState } from "react";
import { fetchContacts } from "../../store/slices/contactSlice";
import { AppState,AppDispatch } from "../../store/store";
import {useSelector, useDispatch } from "react-redux";
import {useSearchParams} from "react-router-dom";
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";

const contactColumns = [
  { header: "Name", accessor: "name" },
  { header: "Email", accessor: "email" },
  { header: "Phone No.", accessor: "phone_no" },
  { header: "address", accessor: "address" },
];

const List: React.FC = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);
      const [searchParams, setSearchParams] = useSearchParams();
      const [keyWord,setKeyWord]=useState("")
      const entityState = useSelector(
          (state: AppState) => state.contact.contacts
        );
      const [params,setParams]=useState({
        search:searchParams.get("search") ||"",
        
      })
      const dispatch = useDispatch<AppDispatch>();
      
      useEffect(() => {
          if (tokens) {
            dispatch(fetchContacts(params));
            // setSearchParams(params)
          }
        },[]);
    
        const handleRefresh = () => {
         if (tokens) {
           dispatch(fetchContacts(params));
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
        await dispatch(fetchContacts(parameters));
      
      }
  
  return (
    <GenericListPage
      title="Contacts"
      entityState={entityState}
      columns={contactColumns}
      createRoute="/contact/create"
      detailRouteBase="/contact/detail"
      onRefresh={handleRefresh}
      getKey={(contact) => contact.id}
      searchFilter={handleFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
