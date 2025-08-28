import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type UpdateFormData, type Data, type DataState, PaginatedData } from "../types";


interface MonthlyPurchaseScheduleState {
    monthlyPurchaseSchedules: DataState<PaginatedData<Data[]> | Data[] | []>;
    monthlyPurchaseSchedule: DataState<Data | null>;
}

const initialState: MonthlyPurchaseScheduleState = {
    monthlyPurchaseSchedules: { data: [], loading: false, error: null },
    monthlyPurchaseSchedule: { data: null, loading: false, error: null },
};

export const fetchMonthlyPurchaseSchedules = createAsyncThunk<PaginatedData<Data[]>, void, { rejectValue: any }>(
    'monthlyPurchaseSchedule/fetchMonthlyPurchaseSchedules',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/purchase/monthly-schedules/');
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch Monthly Purchase Schedules');
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const fetchMonthlyPurchaseSchedule = createAsyncThunk<Data, number | string, { rejectValue: any }>(
    'monthlyPurchaseSchedule/fetchMonthlyPurchaseSchedule',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/purchase/monthly-schedules/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch Monthly Purchase Schedule');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const createMonthlyPurchaseSchedule = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'monthlyPurchaseSchedule/createMonthlyPurchaseSchedule',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/purchase/monthly-schedules/', formData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to create Monthly Purchase Schedule');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const updateMonthlyPurchaseSchedule = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'monthlyPurchaseSchedule/updateMonthlyPurchaseSchedule',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/purchase/monthly-schedules/${id}/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to update Monthly Purchase Schedule');
            }
            return rejectWithValue('An error occured');
        }
    }
)


const monthlyPurchaseScheduleSlice = createSlice({
    name: 'monthlyPurchaseSchedule',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchMonthlyPurchaseSchedules.pending, (state) => {
                state.monthlyPurchaseSchedules.loading = true;
                state.monthlyPurchaseSchedules.error = null;
            })
            .addCase(fetchMonthlyPurchaseSchedules.fulfilled, (state, action: PayloadAction<PaginatedData<Data[]>>) => {
                state.monthlyPurchaseSchedules.loading = false;
                state.monthlyPurchaseSchedules.data = action.payload;
            })
            .addCase(fetchMonthlyPurchaseSchedules.rejected, (state, action) => {
                state.monthlyPurchaseSchedules.loading = false;
                state.monthlyPurchaseSchedules.error = action.payload || 'Unknown error';
            })
            .addCase(fetchMonthlyPurchaseSchedule.pending, (state) => {
                state.monthlyPurchaseSchedule.loading = true;
                state.monthlyPurchaseSchedule.error = null;
            })
            .addCase(fetchMonthlyPurchaseSchedule.fulfilled, (state, action: PayloadAction<Data>) => {
                state.monthlyPurchaseSchedule.loading = false;
                state.monthlyPurchaseSchedule.data = action.payload;
            })
            .addCase(fetchMonthlyPurchaseSchedule.rejected, (state, action) => {
                state.monthlyPurchaseSchedule.loading = false;
                state.monthlyPurchaseSchedule.error = action.payload || 'Unknown error';
            })
            .addCase(createMonthlyPurchaseSchedule.pending, (state) => {
                state.monthlyPurchaseSchedule.loading = true;
                state.monthlyPurchaseSchedule.error = null;
            })
            .addCase(createMonthlyPurchaseSchedule.fulfilled, (state, action: PayloadAction<Data>) => {
                state.monthlyPurchaseSchedule.loading = false;
                state.monthlyPurchaseSchedule.data = action.payload;
            })
            .addCase(createMonthlyPurchaseSchedule.rejected, (state, action) => {
                state.monthlyPurchaseSchedule.loading = false;
                state.monthlyPurchaseSchedule.error = action.payload || 'Unknown error';
            })
            .addCase(updateMonthlyPurchaseSchedule.pending, (state) => {
                state.monthlyPurchaseSchedule.loading = true;
                state.monthlyPurchaseSchedule.error = null;
            })
            .addCase(updateMonthlyPurchaseSchedule.fulfilled, (state, action: PayloadAction<Data>) => {
                state.monthlyPurchaseSchedule.loading = false;
                state.monthlyPurchaseSchedule.data = action.payload;
            })
            .addCase(updateMonthlyPurchaseSchedule.rejected, (state, action) => {
                state.monthlyPurchaseSchedule.loading = false;
                state.monthlyPurchaseSchedule.error = action.payload || 'Unknown error';
            })
    }
})

// export const { createMonthlyPurchaseSchedule, updateMonthlyPurchaseSchedule, deleteMonthlyPurchaseSchedule } = monthlyPurchaseScheduleSlice.actions;
export default monthlyPurchaseScheduleSlice.reducer;