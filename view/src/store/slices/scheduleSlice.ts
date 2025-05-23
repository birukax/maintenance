import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface ScheduleState {
    schedules: DataState;
    schedule: DataState;
}

const initialState: ScheduleState = {
    schedules: {data: [], loading: false, error: null},
    schedule: {data: [], loading: false, error: null},
};

export const fetchSchedules = createAsyncThunk<[], {params:null}, {rejectValue: string}>(
    'schedule/fetchSchedules',
    async(params, {rejectWithValue }) => {
        try {
            const response = await api.get('/schedule/schedules/',{params});
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch schedules');
        }
    }
)


export const fetchSchedule = createAsyncThunk<[], number, { rejectValue: string }>(
    'schedule/fetchSchedule',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/schedule/schedules/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const createSchedule = createAsyncThunk<[],  formData  , { rejectValue: string }>(
    'schedule/createSchedule',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/schedule/schedules/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const updateSchedule = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'schedule/updateSchedule',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/schedule/schedules/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)


export const createScheduledWorkOrder = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'schedule/createScheduledWorkOrder',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/schedule/schedules/${id}/create_work_order/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue( error.response?.data || {message: 'Failed to create work order.'});
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
        .addCase(fetchSchedules.fulfilled, (state, action: PayloadAction<[]>) => {
            state.schedules.loading = false;
            state.schedules.data = action.payload;
        })
        .addCase(fetchSchedules.rejected, (state, action) => {
            state.schedules.loading = false;
            state.schedules.error = action.payload || 'Unknown error';
        })
        .addCase(fetchSchedule.pending, (state) => {
                        state.schedule.loading = true;
                        state.schedule.error = null;
                    })
        .addCase(fetchSchedule.fulfilled, (state, action: PayloadAction<[]>) => {
            state.schedule.loading = false;
            state.schedule.data = action.payload;
        })
        .addCase(fetchSchedule.rejected, (state, action) => {
            state.schedule.loading = false;
            state.schedule.error = action.payload || 'Unknown error';
        })
        .addCase(createSchedule.pending, (state) => {
            state.schedule.loading = true;
            state.schedule.error = null;
        })
        .addCase(createSchedule.fulfilled, (state, action: PayloadAction<[]>) => {
            state.schedule.loading = false;
            state.schedule.data = action.payload;
        })
        .addCase(createSchedule.rejected, (state, action) => {
            state.schedule.loading = false;
            state.schedule.error = action.payload || 'Unknown error';
        })
        .addCase(updateSchedule.pending, (state) => {
            state.schedule.loading = true;
            state.schedule.error = null;
        })
        .addCase(updateSchedule.fulfilled, (state, action: PayloadAction<[]>) => {
            state.schedule.loading = false;
            state.schedule.data = action.payload;
        })
        .addCase(updateSchedule.rejected, (state, action) => {
            state.schedule.loading = false;
            state.schedule.error = action.payload || 'Unknown error';
        })
        .addCase(createScheduledWorkOrder.pending, (state) => {
            state.schedule.loading = true;
            state.schedule.error = null;
        })
        .addCase(createScheduledWorkOrder.fulfilled, (state, action: PayloadAction<[]>) => {
            state.schedule.loading = false;
            state.schedule.data = action.payload;
        })
        .addCase(createScheduledWorkOrder.rejected, (state, action) => {
            state.schedule.loading = false;
            state.schedule.error = action.payload || 'Unknown error';
        })
    }
})

// export const { createSchedule, updateSchedule, deleteSchedule } = scheduleSlice.actions;
export default scheduleSlice.reducer;