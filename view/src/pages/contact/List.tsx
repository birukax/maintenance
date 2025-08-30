// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import { fetchContacts } from "../../store/slices/contactSlice";
import { AppState, AppDispatch } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { GenericListPage } from "../../components/GenericListPage";
import { FetchParams } from "../../store/types";

const contactColumns = [
  { header: "Name", accessor: "name" },
  { header: "Email", accessor: "email" },
  { header: "Phone No.", accessor: "phone_no" },
  { header: "address", accessor: "address" },
];

const List: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyWord, setKeyWord] = useState("")
  const entityState = useSelector(
    (state: AppState) => state.contact.contacts
  );
  const [params, setParams] = useState<FetchParams>({
    search: searchParams.get("search") || "",
    page: searchParams.get("page") || 1
  })
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchContacts(params));
  }, []);

  const handleRefresh = () => {
    dispatch(fetchContacts(params));
  }

  const handleFilter = async (field: string, value: any) => {
    setSearchParams({ ...params, page: '1' });
    setParams(prev => {
      return {
        ...prev,
        [field]: value
      }
    })
    const parameters = {
      ...params, page: '1',
      [field]: value
    }
    setSearchParams({ ...parameters, [field]: value });
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
