// src/hooks/useEntityDetail.ts
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppState, AppDispatch } from '../store/store';
import { SerializedError } from '@reduxjs/toolkit';
import { AsyncThunk } from '@reduxjs/toolkit';

interface EntityDetailState {
  data: [];
  loading: boolean;
  error: string | SerializedError | null;
}

interface UseEntityDetailOptions {
  detailSelector: (state: AppState) => EntityDetailState;
  fetchDetailAction: AsyncThunk<any, string, {}>; // Thunk takes string ID
}


export function useEntityDetail({
  detailSelector,
  fetchDetailAction,
}: UseEntityDetailOptions) {
  const { tokens } = useSelector((state: AppState) => state.auth);
  const entityState = useSelector(detailSelector);
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (tokens && id) {
      dispatch(fetchDetailAction(id));
    }
  }, [dispatch, fetchDetailAction, tokens, id]);

  return {
    ...entityState,
    isAuthenticated: !!tokens,
    id: id,
  };
}
