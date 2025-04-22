// src/pages/List.tsx
import React, { useEffect } from "react";
import { fetchContacts } from "../../store/slices/contactSlice";
import { AppState } from "../../store/store";
import { useEntityList } from "../../hooks/useEntityList";
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
  const entityState = useEntityList({
    listSelector: (state: AppState) => state.contact.contacts,
    fetchListAction: fetchContacts,
  });

  return (
    <GenericListPage
      title="Contacts"
      entityState={entityState}
      columns={contactColumns}
      createRoute="/contact/create"
      detailRouteBase="/contact/detail"
      onRefresh={entityState.refresh}
      getKey={(contact) => contact.id}
    />
  );
};

export default List;
