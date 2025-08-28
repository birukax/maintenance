import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState, PaginatedData } from "../types";

interface ActivityState {
    activities: DataState<PaginatedData<Data[]> | Data[] | []>;
    activity: DataState<Data | null>;
}

const initialState: ActivityState = {
    activities: { data: [], loading: false, error: null },
    activity: { data: null, loading: false, error: null },
};

export const fetchActivities = createAsyncThunk<PaginatedData<Data[]>, FetchParams, { rejectValue: any }>(
    'activity/fetchActivities',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/work-order/activities/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch activities');
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const fetchActivity = createAsyncThunk<Data, number | string, { rejectValue: any }>(
    'activity/fetchActivity',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/work-order/activities/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch activity.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const createActivity = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'activity/createActivity',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/work-order/activities/', formData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to create activity.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const updateActivity = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'activity/updateActivity',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/work-order/activities/${id}/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to update activity.');
            }
            return rejectWithValue('An error occured');
        }
    }
)
export const deleteActivity = createAsyncThunk<Data, { rejectValue: any }>(
    'activity/deleteActivity',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/work-order/activities/${id}/`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to delete activity.');
            }
            return rejectWithValue('An error occured');
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
            .addCase(fetchActivities.fulfilled, (state, action: PayloadAction<PaginatedData<Data[]>>) => {
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
            .addCase(fetchActivity.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(createActivity.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(updateActivity.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(deleteActivity.fulfilled, (state, action: PayloadAction<Data>) => {
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