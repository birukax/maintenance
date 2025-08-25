import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface MonthlyPurchaseScheduleState {
    monthlyPurchaseSchedules: DataState;
    monthlyPurchaseSchedule: DataState;
}

const initialState: MonthlyPurchaseScheduleState = {
    monthlyPurchaseSchedules: { data: [], loading: false, error: null },
    monthlyPurchaseSchedule: { data: [], loading: false, error: null },
};

export const fetchMonthlyPurchaseSchedules = createAsyncThunk<[], void, { rejectValue: any }>(
    'monthlyPurchaseSchedule/fetchMonthlyPurchaseSchedules',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/purchase/monthly-schedules/');
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch Monthly Purchase Schedules');
        }
    }
)


export const fetchMonthlyPurchaseSchedule = createAsyncThunk<[], number, { rejectValue: any }>(
    'monthlyPurchaseSchedule/fetchMonthlyPurchaseSchedule',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/purchase/monthly-schedules/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch Monthly Purchase Schedule');
        }
    }
)

export const createMonthlyPurchaseSchedule = createAsyncThunk<[], formData, { rejectValue: any }>(
    'monthlyPurchaseSchedule/createMonthlyPurchaseSchedule',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/purchase/monthly-schedules/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to create Monthly Purchase Schedule');
        }
    }
)

export const updateMonthlyPurchaseSchedule = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: any }>(
    'monthlyPurchaseSchedule/updateMonthlyPurchaseSchedule',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/purchase/monthly-schedules/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update Monthly Purchase Schedule');
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
            .addCase(fetchMonthlyPurchaseSchedules.fulfilled, (state, action: PayloadAction<[]>) => {
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
            .addCase(fetchMonthlyPurchaseSchedule.fulfilled, (state, action: PayloadAction<[]>) => {
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
            .addCase(createMonthlyPurchaseSchedule.fulfilled, (state, action: PayloadAction<[]>) => {
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
            .addCase(updateMonthlyPurchaseSchedule.fulfilled, (state, action: PayloadAction<[]>) => {
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