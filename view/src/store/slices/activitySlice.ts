import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface ActivityState {
    activities: DataState;
    activity: DataState;
}

const initialState: ActivityState = {
    activities: { data: [], loading: false, error: null },
    activity: { data: [], loading: false, error: null },
};

export const fetchActivities = createAsyncThunk<[], { params: null }, { rejectValue: any }>(
    'activity/fetchActivities',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/work-order/activities/', { params: params });
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch activities');
        }
    }
)


export const fetchActivity = createAsyncThunk<[], number, { rejectValue: any }>(
    'activity/fetchActivity',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/work-order/activities/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const createActivity = createAsyncThunk<[], formData, { rejectValue: any }>(
    'activity/createActivity',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/work-order/activities/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const updateActivity = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: any }>(
    'activity/updateActivity',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/work-order/activities/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)
export const deleteActivity = createAsyncThunk<[], { rejectValue: any }>(
    'activity/deleteActivity',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/work-order/activities/${id}/`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)


const activitySlice = createSlice({
    name: 'activity',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchActivities.pending, (state) => {
                state.activities.loading = true;
                state.activities.error = null;
            })
            .addCase(fetchActivities.fulfilled, (state, action: PayloadAction<[]>) => {
                state.activities.loading = false;
                state.activities.data = action.payload;
            })
            .addCase(fetchActivities.rejected, (state, action) => {
                state.activities.loading = false;
                state.activities.error = action.payload || 'Unknown error';
            })
            .addCase(fetchActivity.pending, (state) => {
                state.activity.loading = true;
                state.activity.error = null;
            })
            .addCase(fetchActivity.fulfilled, (state, action: PayloadAction<[]>) => {
                state.activity.loading = false;
                state.activity.data = action.payload;
            })
            .addCase(fetchActivity.rejected, (state, action) => {
                state.activity.loading = false;
                state.activity.error = action.payload || 'Unknown error';
            })
            .addCase(createActivity.pending, (state) => {
                state.activity.loading = true;
                state.activity.error = null;
            })
            .addCase(createActivity.fulfilled, (state, action: PayloadAction<[]>) => {
                state.activity.loading = false;
                state.activity.data = action.payload;
            })
            .addCase(createActivity.rejected, (state, action) => {
                state.activity.loading = false;
                state.activity.error = action.payload || 'Unknown error';
            })
            .addCase(updateActivity.pending, (state) => {
                state.activity.loading = true;
                state.activity.error = null;
            })
            .addCase(updateActivity.fulfilled, (state, action: PayloadAction<[]>) => {
                state.activity.loading = false;
                state.activity.data = action.payload;
            })
            .addCase(updateActivity.rejected, (state, action) => {
                state.activity.loading = false;
                state.activity.error = action.payload || 'Unknown error';
            })
            .addCase(deleteActivity.pending, (state) => {
                state.activity.loading = true;
                state.activity.error = null;
            })
            .addCase(deleteActivity.fulfilled, (state, action: PayloadAction<[]>) => {
                state.activity.loading = false;
                state.activity.data = action.payload;
            })
            .addCase(deleteActivity.rejected, (state, action) => {
                state.activity.loading = false;
                state.activity.error = action.payload || 'Unknown error';
            })
    }
})

// export const { createActivity, updateActivity, deleteActivity } = activitySlice.actions;
export default activitySlice.reducer;