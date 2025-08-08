import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface WorkOrderActivityState {
    workOrderActivities: DataState;
    workOrderActivity: DataState;
}

const initialState: WorkOrderActivityState = {
    workOrderActivities: { data: [], loading: false, error: null },
    workOrderActivity: { data: [], loading: false, error: null },
};

export const fetchWorkOrderActivities = createAsyncThunk<[], { params: null }, { rejectValue: string }>(
    'workOrderActivity/fetchWorkOrderActivities',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/work-order/work-order-activities/', { params });
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch work orders');
        }
    }
)


export const fetchWorkOrderActivity = createAsyncThunk<[], number, { rejectValue: string }>(
    'workOrderActivity/fetchWorkOrderActivity',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/work-order/work-order-activities/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch work order');
        }
    }
)
export const deleteWorkOrderActivity = createAsyncThunk<[], number, { rejectValue: string }>(
    'workOrderActivity/deleteWorkOrderActivity',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/work-order/work-order-activities/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch work order');
        }
    }
)

export const createWorkOrderActivity = createAsyncThunk<[], formData, { rejectValue: string }>(
    'workOrderActivity/createWorkOrderActivity',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/work-order/work-order-activities/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to create work order');
        }
    }
)

export const updateWorkOrderActivity = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'workOrderActivity/updateWorkOrderActivity',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/work-order/work-order-activities/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update work order');
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
            .addCase(fetchWorkOrderActivities.fulfilled, (state, action: PayloadAction<[]>) => {
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
            .addCase(fetchWorkOrderActivity.fulfilled, (state, action: PayloadAction<[]>) => {
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
            .addCase(createWorkOrderActivity.fulfilled, (state, action: PayloadAction<[]>) => {
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
            .addCase(updateWorkOrderActivity.fulfilled, (state, action: PayloadAction<[]>) => {
                state.workOrderActivity.loading = false;
                state.workOrderActivity.data = action.payload;
            })
            .addCase(updateWorkOrderActivity.rejected, (state, action) => {
                state.workOrderActivity.loading = false;
                state.workOrderActivity.error = action.payload || 'Unknown error';
            })
    }
})

// export const { createWorkOrderActivity, updateWorkOrderActivity, deleteWorkOrderActivity } = WorkOrderActivitySlice.actions;
export default WorkOrderActivitySlice.reducer;