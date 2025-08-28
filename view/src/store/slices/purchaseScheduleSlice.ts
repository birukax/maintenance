import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState, PaginatedData } from "../types";


interface PurchaseScheduleState {
    purchaseSchedules: DataState<PaginatedData<Data[]> | Data[] | []>;
    purchaseSchedule: DataState<Data | null>;
}

const initialState: PurchaseScheduleState = {
    purchaseSchedules: { data: [], loading: false, error: null },
    purchaseSchedule: { data: null, loading: false, error: null },
};


export const fetchPurchaseSchedules = createAsyncThunk<PaginatedData<Data[]>, FetchParams, { rejectValue: any }>(
    'purchaseSchedule/fetchPurchaseSchedules',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/purchase/schedules/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch Purchase Schedules');
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const fetchPurchaseSchedule = createAsyncThunk<Data, number | string, { rejectValue: any }>(
    'purchaseSchedule/fetchPurchaseSchedule',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/purchase/schedules/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch Purchase Schedule');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const createPurchaseSchedule = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'purchaseSchedule/createPurchaseSchedule',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/purchase/schedules/', formData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to create Purchase Schedule');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const updatePurchaseSchedule = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'purchaseSchedule/updatePurchaseSchedule',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/purchase/schedules/${id}/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to update Purchase Schedule');
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const createAnnualSchedule = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'purchaseSchedule/createAnnualSchedule',
    async ({ formData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/purchase/schedules/create_annual_schedule/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to create annual schedule');
            }
            return rejectWithValue('An error occured');
        }
    }
)



const purchaseScheduleSlice = createSlice({
    name: 'purchaseSchedule',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPurchaseSchedules.pending, (state) => {
                state.purchaseSchedules.loading = true;
                state.purchaseSchedules.error = null;
            })
            .addCase(fetchPurchaseSchedules.fulfilled, (state, action: PayloadAction<PaginatedData<Data[]>>) => {
                state.purchaseSchedules.loading = false;
                state.purchaseSchedules.data = action.payload;
            })
            .addCase(fetchPurchaseSchedules.rejected, (state, action) => {
                state.purchaseSchedules.loading = false;
                state.purchaseSchedules.error = action.payload || 'Unknown error';
            })
            .addCase(fetchPurchaseSchedule.pending, (state) => {
                state.purchaseSchedule.loading = true;
                state.purchaseSchedule.error = null;
            })
            .addCase(fetchPurchaseSchedule.fulfilled, (state, action: PayloadAction<Data>) => {
                state.purchaseSchedule.loading = false;
                state.purchaseSchedule.data = action.payload;
            })
            .addCase(fetchPurchaseSchedule.rejected, (state, action) => {
                state.purchaseSchedule.loading = false;
                state.purchaseSchedule.error = action.payload || 'Unknown error';
            })
            .addCase(createPurchaseSchedule.pending, (state) => {
                state.purchaseSchedule.loading = true;
                state.purchaseSchedule.error = null;
            })
            .addCase(createPurchaseSchedule.fulfilled, (state, action: PayloadAction<Data>) => {
                state.purchaseSchedule.loading = false;
                state.purchaseSchedule.data = action.payload;
            })
            .addCase(createPurchaseSchedule.rejected, (state, action) => {
                state.purchaseSchedule.loading = false;
                state.purchaseSchedule.error = action.payload || 'Unknown error';
            })
            .addCase(updatePurchaseSchedule.pending, (state) => {
                state.purchaseSchedule.loading = true;
                state.purchaseSchedule.error = null;
            })
            .addCase(updatePurchaseSchedule.fulfilled, (state, action: PayloadAction<Data>) => {
                state.purchaseSchedule.loading = false;
                state.purchaseSchedule.data = action.payload;
            })
            .addCase(updatePurchaseSchedule.rejected, (state, action) => {
                state.purchaseSchedule.loading = false;
                state.purchaseSchedule.error = action.payload || 'Unknown error';
            })
            .addCase(createAnnualSchedule.pending, (state) => {
                state.purchaseSchedule.loading = true;
                state.purchaseSchedule.error = null;
            })
            .addCase(createAnnualSchedule.fulfilled, (state, action: PayloadAction<Data>) => {
                state.purchaseSchedule.loading = false;
                state.purchaseSchedule.data = action.payload;
            })
            .addCase(createAnnualSchedule.rejected, (state, action) => {
                state.purchaseSchedule.loading = false;
                state.purchaseSchedule.error = action.payload || 'Unknown error';
            })
    }
})


// export const { createPurchaseSchedule, updatePurchaseSchedule, deletePurchaseSchedule } = purchaseScheduleSlice.actions;
// export const { clearPurchaseSchedules } = purchaseScheduleSlice.actions
export default purchaseScheduleSlice.reducer;