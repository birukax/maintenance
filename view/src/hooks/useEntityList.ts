import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppState, AppDispatch } from "../store/store";
import { SerializedError } from "@reduxjs/toolkit";
import { AsyncThunk } from "@reduxjs/toolkit";

interface EntityListState {
  data: [] | null;
  loading: boolean;
  error: string | SerializedError | null;
}

interface UseEntityListOptions {
  listSelector: (state: AppState) => EntityListState;
  fetchListAction: AsyncThunk<any, void, {}>;
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
  const filter = (searchParams: string | null) => {
    
    const params=sessionStorage.getItem("params")
    if (tokens) {
      if (params){

        dispatch(fetchListAction(params));
      }
      else
      {
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
