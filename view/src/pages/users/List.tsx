// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import { fetchProfiles } from "../../store/slices/profileSlice";
import { AppState, AppDispatch } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom"
import { type Data, type FetchParams } from '../../store/types';
import {
  GenericListPage,
} from "../../components/GenericListPage";

const profileColumns = [
  { header: "Username", accessor: "user.username" },
  { header: "Phone_no", accessor: "phone_no" },
  { header: "Role", accessor: "role" },
  { header: "Is Active", accessor: "user.is_active" },
];

const List: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyWord, setKeyWord] = useState("")
  const entityState = useSelector(
    (state: AppState) => state.profile.profiles
  );
  const [params, setParams] = useState<FetchParams>({
    search: searchParams.get("search") || "",
    page: searchParams.get("page") || 1
  })
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchProfiles(params));
  }, []);

  const handleRefresh = () => {
    dispatch(fetchProfiles(params));
  }

  const handleFilter = async (field: string, value: any) => {
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
    await dispatch(fetchProfiles(parameters));

  }

  return (
    <GenericListPage
      title="Users"
      entityState={entityState}
      columns={profileColumns}
      createRoute="/user/create"
      detailRouteBase="/user/detail"
      onRefresh={handleRefresh}
      getKey={(profile: Data) => profile.id}
      searchFilter={handleFilter}
      keyWord={keyWord}
      setKeyWord={setKeyWord}
    />
  );
};

export default List;
