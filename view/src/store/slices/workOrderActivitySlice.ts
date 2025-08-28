import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState, PaginatedData } from "../types";


interface WorkOrderActivityState {
    workOrderActivities: DataState<PaginatedData<Data[]> | Data[] | []>;
    workOrderActivity: DataState<Data | null>;
}

const initialState: WorkOrderActivityState = {
    workOrderActivities: { data: [], loading: false, error: null },
    workOrderActivity: { data: null, loading: false, error: null },
};

export const fetchWorkOrderActivities = createAsyncThunk<PaginatedData<Data[]>, FetchParams, { rejectValue: any }>(
    'workOrderActivity/fetchWorkOrderActivities',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/work-order/work-order-activities/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch work order activities.');
            }
            return rejectWithValue('An error occured')
        }
    }
)


export const fetchWorkOrderActivity = createAsyncThunk<Data, number | string, { rejectValue: any }>(
    'workOrderActivity/fetchWorkOrderActivity',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/work-order/work-order-activities/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch work order activity.');
            }
            return rejectWithValue('An error occured')
        }
    }
)

export const createWorkOrderActivity = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'workOrderActivity/createWorkOrderActivity',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/work-order/work-order-activities/', formData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to create work order activity.');
            }
            return rejectWithValue('An error occured')
        }
    }
)

export const updateWorkOrderActivity = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'workOrderActivity/updateWorkOrderActivity',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/work-order/work-order-activities/${id}/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to update work order activity.');
            }
            return rejectWithValue('An error occured')
        }
    }
)

export const deleteWorkOrderActivity = createAsyncThunk<void, number | string, { rejectValue: any }>(
    'workOrderActivity/deleteWorkOrderActivity',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/work-order/work-order-activities/${id}/`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to delete work order activity.');
            }
            return rejectWithValue('An error occured')
        }
    }
)



const WorkOrderActivitySlice = createSlice({
    name: 'workOrderActivity',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchWorkOrderActivities.pending, (state) => {
                state.workOrderActivities.loading = true;
                state.workOrderActivities.error = null;
            })
            .addCase(fetchWorkOrderActivities.fulfilled, (state, action: PayloadAction<PaginatedData<Data[]>>) => {
                state.workOrderActivities.loading = false;
                state.workOrderActivities.data = action.payload;
            })
            .addCase(fetchWorkOrderActivities.rejected, (state, action) => {
                state.workOrderActivities.loading = false;
                state.workOrderActivities.error = action.payload || 'Unknown error';
            })
            .addCase(fetchWorkOrderActivity.pending, (state) => {
                state.workOrderActivity.loading = true;
                state.workOrderActivity.error = null;
            })
            .addCase(fetchWorkOrderActivity.fulfilled, (state, action: PayloadAction<Data>) => {
                state.workOrderActivity.loading = false;
                state.workOrderActivity.data = action.payload;
            })
            .addCase(fetchWorkOrderActivity.rejected, (state, action) => {
                state.workOrderActivity.loading = false;
                state.workOrderActivity.error = action.payload || 'Unknown error';
            })
            .addCase(createWorkOrderActivity.pending, (state) => {
                state.workOrderActivity.loading = true;
                state.workOrderActivity.error = null;
            })
            .addCase(createWorkOrderActivity.fulfilled, (state, action: PayloadAction<Data>) => {
                state.workOrderActivity.loading = false;
                state.workOrderActivity.data = action.payload;
            })
            .addCase(createWorkOrderActivity.rejected, (state, action) => {
                state.workOrderActivity.loading = false;
                state.workOrderActivity.error = action.payload || 'Unknown error';
            })
            .addCase(updateWorkOrderActivity.pending, (state) => {
                state.workOrderActivity.loading = true;
                state.workOrderActivity.error = null;
            })
            .addCase(updateWorkOrderActivity.fulfilled, (state, action: PayloadAction<Data>) => {
                state.workOrderActivity.loading = false;
                state.workOrderActivity.data = action.payload;
            })
            .addCase(updateWorkOrderActivity.rejected, (state, action) => {
                state.workOrderActivity.loading = false;
                state.workOrderActivity.error = action.payload || 'Unknown error';
            })
            .addCase(deleteWorkOrderActivity.pending, (state) => {
                state.workOrderActivity.loading = true;
                state.workOrderActivity.error = null;
            })
            .addCase(deleteWorkOrderActivity.fulfilled, (state) => {
                state.workOrderActivity.loading = false;
                state.workOrderActivity.data = null;
            })
            .addCase(deleteWorkOrderActivity.rejected, (state, action) => {
                state.workOrderActivity.loading = false;
                state.workOrderActivity.error = action.payload || 'Unknown error';
            })
    }
})

// export const { createWorkOrderActivity, updateWorkOrderActivity, deleteWorkOrderActivity } = WorkOrderActivitySlice.actions;
export default WorkOrderActivitySlice.reducer;