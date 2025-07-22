import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface Schedule {
    id: number;
    [key: string]: any;
}

interface DataState<T> {
    data: T;
    loading: boolean;
    error: any;
}

interface ScheduleState {
    schedules: DataState<Schedule[]>;
    schedule: DataState<Schedule | null>;
    scheduledWorkOrder: { loading: boolean; error: any };
}

const initialState: ScheduleState = {
    schedules: { data: [], loading: false, error: null },
    schedule: { data: null, loading: false, error: null },
    scheduledWorkOrder: { loading: false, error: null },
};

export const fetchSchedules = createAsyncThunk<Schedule[], { params: null | undefined }, { rejectValue: any }>(
    'schedule/fetchSchedules',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/schedule/schedules/', { params });
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch schedules');
        }
    }
)


export const fetchSchedule = createAsyncThunk<Schedule, number, { rejectValue: any }>(
    'schedule/fetchSchedule',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/schedule/schedules/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch schedule.');
        }
    }
)

export const createSchedule = createAsyncThunk<Schedule, { [key: string]: any }, { rejectValue: any }>(
    'schedule/createSchedule',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/schedule/schedules/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || "Failed to create schedule.");
        }
    }
)

export const updateSchedule = createAsyncThunk<Schedule, { id: string, formData: { [key: string] } }, { rejectValue: any }>(
    'schedule/updateSchedule',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/schedule/schedules/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update schedule.");
        }
    }
)


export const createScheduledWorkOrder = createAsyncThunk<any, { id: string | number, formData: { [key: string]: any } }, { rejectValue: any }>(
    'schedule/createScheduledWorkOrder',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/schedule/schedules/${id}/create_work_order/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to create work order.");
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
            .addCase(fetchSchedules.fulfilled, (state, action: PayloadAction<Schedule[]>) => {
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
            .addCase(fetchSchedule.fulfilled, (state, action: PayloadAction<Schedule>) => {
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
            .addCase(createSchedule.fulfilled, (state, action: PayloadAction<Schedule>) => {
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
            .addCase(updateSchedule.fulfilled, (state, action: PayloadAction<Schedule>) => {
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
            .addCase(createScheduledWorkOrder.fulfilled, (state, action: PayloadAction<any>) => {
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