import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState } from "../types";


interface ReturnState {
    returns: DataState<Data[]>;
    return: DataState<Data | null>;
}

const initialState: ReturnState = {
    returns: { data: [], loading: false, error: null },
    return: { data: null, loading: false, error: null },
};

export const fetchReturns = createAsyncThunk<Data[], FetchParams, { rejectValue: any }>(
    'return/fetchReturns',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/inventory/returns/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch returns');
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const fetchReturn = createAsyncThunk<Data, number | string, { rejectValue: any }>(
    'return/fetchReturn',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/inventory/returns/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch return.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const createReturn = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'return/createReturn',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/inventory/returns/', formData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to create return.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const updateReturn = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'return/updateReturn',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/inventory/returns/${id}/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to update return.');
            }
            return rejectWithValue('An error occured');
        }
    }
)


const returnSlice = createSlice({
    name: 'return',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchReturns.pending, (state) => {
                state.returns.loading = true;
                state.returns.error = null;
            })
            .addCase(fetchReturns.fulfilled, (state, action: PayloadAction<Data[]>) => {
                state.returns.loading = false;
                state.returns.data = action.payload;
            })
            .addCase(fetchReturns.rejected, (state, action) => {
                state.returns.loading = false;
                state.returns.error = action.payload || 'Unknown error';
            })
            .addCase(fetchReturn.pending, (state) => {
                state.return.loading = true;
                state.return.error = null;
            })
            .addCase(fetchReturn.fulfilled, (state, action: PayloadAction<Data>) => {
                state.return.loading = false;
                state.return.data = action.payload;
            })
            .addCase(fetchReturn.rejected, (state, action) => {
                state.return.loading = false;
                state.return.error = action.payload || 'Unknown error';
            })
            .addCase(createReturn.pending, (state) => {
                state.return.loading = true;
                state.return.error = null;
            })
            .addCase(createReturn.fulfilled, (state, action: PayloadAction<Data>) => {
                state.return.loading = false;
                state.return.data = action.payload;
            })
            .addCase(createReturn.rejected, (state, action) => {
                state.return.loading = false;
                state.return.error = action.payload || 'Unknown error';
            })
            .addCase(updateReturn.pending, (state) => {
                state.return.loading = true;
                state.return.error = null;
            })
            .addCase(updateReturn.fulfilled, (state, action: PayloadAction<Data>) => {
                state.return.loading = false;
                state.return.data = action.payload;
            })
            .addCase(updateReturn.rejected, (state, action) => {
                state.return.loading = false;
                state.return.error = action.payload || 'Unknown error';
            })
    }
})

// export const { createReturn, updateReturn, deleteReturn } = returnSlice.actions;
export default returnSlice.reducer;