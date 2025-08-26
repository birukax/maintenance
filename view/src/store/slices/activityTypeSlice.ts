import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState } from "../types";


interface ActivityTypeState {
    activityTypes: DataState<Data[]>;
    activityType: DataState<Data | null>;
}

const initialState: ActivityTypeState = {
    activityTypes: { data: [], loading: false, error: null },
    activityType: { data: null, loading: false, error: null },
};

export const fetchActivityTypes = createAsyncThunk<Data[], FetchParams, { rejectValue: any }>(
    'activityType/fetchActivityTypes',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/work-order/activity-types/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch activity types');
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const fetchActivityType = createAsyncThunk<Data, number | string, { rejectValue: any }>(
    'activityType/fetchActivityType',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/work-order/activity-types/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch activity type.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const createActivityType = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'activityType/createActivityType',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/work-order/activity-types/', formData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to create activity type.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const updateActivityType = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'activityType/updateActivityType',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/work-order/activity-types/${id}/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to update activity type.');
            }
            return rejectWithValue('An error occured');
        }
    }
)


const activityTypeSlice = createSlice({
    name: 'activityType',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchActivityTypes.pending, (state) => {
                state.activityTypes.loading = true;
                state.activityTypes.error = null;
            })
            .addCase(fetchActivityTypes.fulfilled, (state, action: PayloadAction<Data[]>) => {
                state.activityTypes.loading = false;
                state.activityTypes.data = action.payload;
            })
            .addCase(fetchActivityTypes.rejected, (state, action) => {
                state.activityTypes.loading = false;
                state.activityTypes.error = action.payload || 'Unknown error';
            })
            .addCase(fetchActivityType.pending, (state) => {
                state.activityType.loading = true;
                state.activityType.error = null;
            })
            .addCase(fetchActivityType.fulfilled, (state, action: PayloadAction<Data>) => {
                state.activityType.loading = false;
                state.activityType.data = action.payload;
            })
            .addCase(fetchActivityType.rejected, (state, action) => {
                state.activityType.loading = false;
                state.activityType.error = action.payload || 'Unknown error';
            })
            .addCase(createActivityType.pending, (state) => {
                state.activityType.loading = true;
                state.activityType.error = null;
            })
            .addCase(createActivityType.fulfilled, (state, action: PayloadAction<Data>) => {
                state.activityType.loading = false;
                state.activityType.data = action.payload;
            })
            .addCase(createActivityType.rejected, (state, action) => {
                state.activityType.loading = false;
                state.activityType.error = action.payload || 'Unknown error';
            })
            .addCase(updateActivityType.pending, (state) => {
                state.activityType.loading = true;
                state.activityType.error = null;
            })
            .addCase(updateActivityType.fulfilled, (state, action: PayloadAction<Data>) => {
                state.activityType.loading = false;
                state.activityType.data = action.payload;
            })
            .addCase(updateActivityType.rejected, (state, action) => {
                state.activityType.loading = false;
                state.activityType.error = action.payload || 'Unknown error';
            })
    }
})

// export const { createActivityType, updateActivityType, deleteActivityType } = activityTypeSlice.actions;
export default activityTypeSlice.reducer;