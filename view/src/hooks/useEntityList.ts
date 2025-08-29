import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppState, AppDispatch } from "../store/store";
// import { SerializedError } from "@reduxjs/toolkit";
import { AsyncThunk } from "@reduxjs/toolkit";
import { type Data, type PaginatedData, type DataState } from "../store/types";

export interface EntityListState {
  data: DataState<PaginatedData<Data[]> | any>;
  loading: boolean;
  error: any;
}

interface UseEntityListOptions {
  listSelector: (state: AppState) => EntityListState;
  fetchListAction: AsyncThunk<Data[], void, object>;
  searchParams: "" | null;
}

export const useEntityList = ({
  listSelector,
  fetchListAction,
  searchParams,
}: UseEntityListOptions) => {
  const { tokens } = useSelector((state: AppState) => state.auth);
  const entityState = useSelector(listSelector);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (tokens) {
      if (searchParams) {
        dispatch(fetchListAction(searchParams));
      } else {
        dispatch(fetchListAction());
      }
    }
  }, [tokens]);

  const refresh = () => {
    if (tokens) {
      dispatch(fetchListAction());
    }
  };
  const filter = () => {

    const params = sessionStorage.getItem("params")
    if (tokens) {
      if (params) {

        dispatch(fetchListAction());
      }
      else {
        dispatch(fetchListAction());
      }
    }
  };

  return {
    ...entityState,
    refresh,
    filter,
    isAuthenticated: !!tokens,
  };
};
