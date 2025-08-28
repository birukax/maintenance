import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState, PaginatedData } from "../types";


interface ClearanceState {
    clearances: DataState<PaginatedData<Data[]> | Data[] | []>;
    clearance: DataState<Data | null>;
}

const initialState: ClearanceState = {
    clearances: { data: [], loading: false, error: null },
    clearance: { data: null, loading: false, error: null },
};

export const fetchClearances = createAsyncThunk<PaginatedData<Data[]>, FetchParams, { rejectValue: any }>(
    'clearance/fetchClearances',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/work-order/clearances/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch clearances');
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const fetchClearance = createAsyncThunk<Data, number | string, { rejectValue: any }>(
    'clearance/fetchClearance',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/work-order/clearances/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch clearance.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const createClearance = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'clearance/createClearance',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/work-order/clearances/', formData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || "Failed to create clearance.");
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const updateClearance = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'clearance/updateClearance',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/work-order/clearances/${id}/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || "Failed to update clearance.");
            }
            return rejectWithValue('An error occured');
        }
    }
)


const clearanceSlice = createSlice({
    name: 'clearance',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchClearances.pending, (state) => {
                state.clearances.loading = true;
                state.clearances.error = null;
            })
            .addCase(fetchClearances.fulfilled, (state, action: PayloadAction<PaginatedData<Data[]>>) => {
                state.clearances.loading = false;
                state.clearances.data = action.payload;
            })
            .addCase(fetchClearances.rejected, (state, action) => {
                state.clearances.loading = false;
                state.clearances.error = action.payload;
            })
            .addCase(fetchClearance.pending, (state) => {
                state.clearance.loading = true;
                state.clearance.error = null;
            })
            .addCase(fetchClearance.fulfilled, (state, action: PayloadAction<Data>) => {
                state.clearance.loading = false;
                state.clearance.data = action.payload;
            })
            .addCase(fetchClearance.rejected, (state, action) => {
                state.clearance.loading = false;
                state.clearance.error = action.payload;
            })
            .addCase(createClearance.pending, (state) => {
                state.clearance.loading = true;
                state.clearance.error = null;
            })
            .addCase(createClearance.fulfilled, (state, action: PayloadAction<Data>) => {
                state.clearance.loading = false;
                state.clearance.data = action.payload;
            })
            .addCase(createClearance.rejected, (state, action) => {
                state.clearance.loading = false;
                state.clearance.error = action.payload;
            })
            .addCase(updateClearance.pending, (state) => {
                state.clearance.loading = true;
                state.clearance.error = null;
            })
            .addCase(updateClearance.fulfilled, (state, action: PayloadAction<Data>) => {
                state.clearance.loading = false;
                state.clearance.data = action.payload;
            })
            .addCase(updateClearance.rejected, (state, action) => {
                state.clearance.loading = false;
                state.clearance.error = action.payload;
            })
    }
})

// export const { createClearance, updateClearance, deleteSchedule } = clearanceSlice.actions;
export default clearanceSlice.reducer;