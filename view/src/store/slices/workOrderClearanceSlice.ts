import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface WorkOrderClearanceState {
    workOrderClearances: DataState;
    workOrderClearance: DataState;
}

const initialState: WorkOrderClearanceState = {
    workOrderClearances: { data: [], loading: false, error: null },
    workOrderClearance: { data: [], loading: false, error: null },
};

export const fetchWorkOrderClearances = createAsyncThunk<[], { params: null }, { rejectValue: string }>(
    'workOrderClearance/fetchWorkOrderClearances',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/work-order/work-order-clearances/', { params });
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch work order clearances');
        }
    }
)


export const fetchWorkOrderClearance = createAsyncThunk<[], number, { rejectValue: string }>(
    'workOrderClearance/fetchWorkOrderClearance',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/work-order/work-order-clearances/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch work order clearance');
        }
    }
)
export const deleteWorkOrderClearance = createAsyncThunk<[], number, { rejectValue: string }>(
    'workOrderClearance/deleteWorkOrderClearance',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/work-order/work-order-clearances/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch work order clearance');
        }
    }
)

export const createWorkOrderClearance = createAsyncThunk<[], formData, { rejectValue: string }>(
    'workOrderClearance/createWorkOrderClearance',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/work-order/work-order-clearances/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to create work order clearance');
        }
    }
)

export const updateWorkOrderClearance = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'workOrderClearance/updateWorkOrderClearance',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/work-order/work-order-clearances/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update work order clearance');
        }
    }
)




const WorkOrderClearanceSlice = createSlice({
    name: 'workOrderClearance',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchWorkOrderClearances.pending, (state) => {
                state.workOrderClearances.loading = true;
                state.workOrderClearances.error = null;
            })
            .addCase(fetchWorkOrderClearances.fulfilled, (state, action: PayloadAction<[]>) => {
                state.workOrderClearances.loading = false;
                state.workOrderClearances.data = action.payload;
            })
            .addCase(fetchWorkOrderClearances.rejected, (state, action) => {
                state.workOrderClearances.loading = false;
                state.workOrderClearances.error = action.payload || 'Unknown error';
            })
            .addCase(fetchWorkOrderClearance.pending, (state) => {
                state.workOrderClearance.loading = true;
                state.workOrderClearance.error = null;
            })
            .addCase(fetchWorkOrderClearance.fulfilled, (state, action: PayloadAction<[]>) => {
                state.workOrderClearance.loading = false;
                state.workOrderClearance.data = action.payload;
            })
            .addCase(fetchWorkOrderClearance.rejected, (state, action) => {
                state.workOrderClearance.loading = false;
                state.workOrderClearance.error = action.payload || 'Unknown error';
            })
            .addCase(createWorkOrderClearance.pending, (state) => {
                state.workOrderClearance.loading = true;
                state.workOrderClearance.error = null;
            })
            .addCase(createWorkOrderClearance.fulfilled, (state, action: PayloadAction<[]>) => {
                state.workOrderClearance.loading = false;
                state.workOrderClearance.data = action.payload;
            })
            .addCase(createWorkOrderClearance.rejected, (state, action) => {
                state.workOrderClearance.loading = false;
                state.workOrderClearance.error = action.payload || 'Unknown error';
            })
            .addCase(updateWorkOrderClearance.pending, (state) => {
                state.workOrderClearance.loading = true;
                state.workOrderClearance.error = null;
            })
            .addCase(updateWorkOrderClearance.fulfilled, (state, action: PayloadAction<[]>) => {
                state.workOrderClearance.loading = false;
                state.workOrderClearance.data = action.payload;
            })
            .addCase(updateWorkOrderClearance.rejected, (state, action) => {
                state.workOrderClearance.loading = false;
                state.workOrderClearance.error = action.payload || 'Unknown error';
            })
    }
})

// export const { createWorkOrderActivity, updateWorkOrderActivity, deleteWorkOrderActivity } = WorkOrderClearanceSlice.actions;
export default WorkOrderClearanceSlice.reducer;