import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, AppDispatch } from '../store/store';
import { SerializedError } from '@reduxjs/toolkit';
import { AsyncThunk } from '@reduxjs/toolkit';

interface EntityListState {
    data: [] | null;
    loading: boolean;
    error: string | SerializedError | null;
}

interface UseEntityListOptions {
    listSelector: (state: AppState) => EntityListState;
    fetchListAction: AsyncThunk<any, void, {}>;
}

export const useEntityList = ({listSelector, fetchListAction}: UseEntityListOptions) => {
    const { tokens } = useSelector((state: AppState) => state.auth);
    const entityState = useSelector(listSelector);
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        if (tokens ){
            dispatch(fetchListAction());
        }
    }, [tokens]);

    const refresh = () => {
        if(tokens){
            dispatch(fetchListAction());
        }
    };
    return {
        ...entityState,
        refresh,
        isAuthenticated: !!tokens,
    }
    
}