import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState } from "../types";


interface ScheduleState {
    schedules: DataState<Data[]>;
    schedule: DataState<Data | null>;
    scheduledWorkOrder: { loading: boolean; error: any };
}

const initialState: ScheduleState = {
    schedules: { data: [], loading: false, error: null },
    schedule: { data: null, loading: false, error: null },
    scheduledWorkOrder: { loading: false, error: null },
};

export const fetchSchedules = createAsyncThunk<Data[], FetchParams, { rejectValue: any }>(
    'schedule/fetchSchedules',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/schedule/schedules/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch schedules');
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const fetchSchedule = createAsyncThunk<Data, number, { rejectValue: any }>(
    'schedule/fetchSchedule',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/schedule/schedules/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch schedule.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const createSchedule = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'schedule/createSchedule',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/schedule/schedules/', formData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || "Failed to create schedule.");
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const updateSchedule = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'schedule/updateSchedule',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/schedule/schedules/${id}/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || "Failed to update schedule.");
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const createScheduledWorkOrder = createAsyncThunk<any, UpdateFormData, { rejectValue: any }>(
    'schedule/createScheduledWorkOrder',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/schedule/schedules/${id}/create_work_order/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || "Failed to create work order.");
            }
            return rejectWithValue('An error occured');
        }
    }
)



const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchSchedules.pending, (state) => {
                state.schedules.loading = true;
                state.schedules.error = null;
            })
            .addCase(fetchSchedules.fulfilled, (state, action: PayloadAction<Data[]>) => {
                state.schedules.loading = false;
                state.schedules.data = action.payload;
            })
            .addCase(fetchSchedules.rejected, (state, action) => {
                state.schedules.loading = false;
                state.schedules.error = action.payload;
            })
            .addCase(fetchSchedule.pending, (state) => {
                state.schedule.loading = true;
                state.schedule.error = null;
            })
            .addCase(fetchSchedule.fulfilled, (state, action: PayloadAction<Data>) => {
                state.schedule.loading = false;
                state.schedule.data = action.payload;
            })
            .addCase(fetchSchedule.rejected, (state, action) => {
                state.schedule.loading = false;
                state.schedule.error = action.payload;
            })
            .addCase(createSchedule.pending, (state) => {
                state.schedule.loading = true;
                state.schedule.error = null;
            })
            .addCase(createSchedule.fulfilled, (state, action: PayloadAction<Data>) => {
                state.schedule.loading = false;
                state.schedule.data = action.payload;
            })
            .addCase(createSchedule.rejected, (state, action) => {
                state.schedule.loading = false;
                state.schedule.error = action.payload;
            })
            .addCase(updateSchedule.pending, (state) => {
                state.schedule.loading = true;
                state.schedule.error = null;
            })
            .addCase(updateSchedule.fulfilled, (state, action: PayloadAction<Data>) => {
                state.schedule.loading = false;
                state.schedule.data = action.payload;
            })
            .addCase(updateSchedule.rejected, (state, action) => {
                state.schedule.loading = false;
                state.schedule.error = action.payload;
            })
            .addCase(createScheduledWorkOrder.pending, (state) => {
                state.scheduledWorkOrder.loading = true;
                state.scheduledWorkOrder.error = null;
            })
            .addCase(createScheduledWorkOrder.fulfilled, (state) => {
                state.scheduledWorkOrder.loading = false;
                // state.scheduledWorkOrder.data = action.payload;
            })
            .addCase(createScheduledWorkOrder.rejected, (state, action) => {
                state.scheduledWorkOrder.loading = false;
                state.scheduledWorkOrder.error = action.payload
            })
    }
})

// export const { createSchedule, updateSchedule, deleteSchedule } = scheduleSlice.actions;
export default scheduleSlice.reducer;