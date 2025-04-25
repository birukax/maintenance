import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface WorkOrderState {
    workOrders: DataState;
    workOrder: DataState;
}

const initialState: WorkOrderState = {
    workOrders: {data: null, loading: false, error: null},
    workOrder: {data: null, loading: false, error: null},
};

export const fetchWorkOrders = createAsyncThunk<[], void, {rejectValue: string}>(
    'workOrder/fetchWorkOrders',
    async(_, {rejectWithValue }) => {
        try {
            const response = await api.get('/work-order/work-orders/');
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch work orders');
        }
    }
)


export const fetchWorkOrder = createAsyncThunk<[], number, { rejectValue: string }>(
    'workOrder/fetchWorkOrder',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/work-order/work-orders/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch work order');
        }
    }
)

export const createWorkOrder = createAsyncThunk<[],  formData  , { rejectValue: string }>(
    'workOrder/createWorkOrder',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/work-order/work-orders/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to create work order');
        }
    }
)

export const updateWorkOrder = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'workOrder/updateWorkOrder',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/work-order/work-orders/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update work order');
        }
    }
)

export const createWorkOrderActivities = createAsyncThunk<[],{ id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'workOrder/createWorkOrderActivities',
    async ({ id, formData }, { rejectWithValue}) => {
        try {
            const response = await api.post(`/work-order/work-orders/${id}/create_activities/`, formData)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to create work order activities');
        }
    }
)

export const assignWorkOrderUsers = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'profile/assignWorkOrderUsers',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/work-order/work-orders/${id}/assign_users/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

const WorkOrderSlice = createSlice({
    name: 'workOrder',
    initialState,
    reducers: {},
    
    extraReducers: (builder) => {
        builder
        .addCase(fetchWorkOrders.pending, (state) => {
            state.workOrders.loading = true;
            state.workOrders.error = null;
        })
        .addCase(fetchWorkOrders.fulfilled, (state, action: PayloadAction<[]>) => {
            state.workOrders.loading = false;
            state.workOrders.data = action.payload;
        })
        .addCase(fetchWorkOrders.rejected, (state, action) => {
            state.workOrders.loading = false;
            state.workOrders.error = action.payload || 'Unknown error';
        })
        .addCase(fetchWorkOrder.pending, (state) => {
            state.workOrder.loading = true;
            state.workOrder.error = null;
        })
        .addCase(fetchWorkOrder.fulfilled, (state, action: PayloadAction<[]>) => {
            state.workOrder.loading = false;
            state.workOrder.data = action.payload;
        })
        .addCase(fetchWorkOrder.rejected, (state, action) => {
            state.workOrder.loading = false;
            state.workOrder.error = action.payload || 'Unknown error';
        })
        .addCase(createWorkOrder.pending, (state) => {
            state.workOrder.loading = true;
            state.workOrder.error = null;
        })
        .addCase(createWorkOrder.fulfilled, (state, action: PayloadAction<[]>) => {
            state.workOrder.loading = false;
            state.workOrder.data = action.payload;
        })
        .addCase(createWorkOrder.rejected, (state, action) => {
            state.workOrder.loading = false;
            state.workOrder.error = action.payload || 'Unknown error';
        })
        .addCase(updateWorkOrder.pending, (state) => {
            state.workOrder.loading = true;
            state.workOrder.error = null;
        })
        .addCase(updateWorkOrder.fulfilled, (state, action: PayloadAction<[]>) => {
            state.workOrder.loading = false;
            state.workOrder.data = action.payload;
        })
        .addCase(updateWorkOrder.rejected, (state, action) => {
            state.workOrder.loading = false;
            state.workOrder.error = action.payload || 'Unknown error';
        })
        .addCase(createWorkOrderActivities.pending, (state) => {
            state.workOrder.loading = true;
            state.workOrder.error = null;
        })
        .addCase(createWorkOrderActivities.fulfilled, (state, action: PayloadAction<[]>) => {
            state.workOrder.loading = false;
            state.workOrder.data = action.payload;
        })
        .addCase(createWorkOrderActivities.rejected, (state, action) => {
            state.workOrder.loading = false;
            state.workOrder.error = action.payload || 'Unknown error';
        })
        .addCase(assignWorkOrderUsers.pending, (state) => {
            state.workOrder.loading = true;
            state.workOrder.error = null;
        })
        .addCase(assignWorkOrderUsers.fulfilled, (state, action: PayloadAction<[]>) => {
            state.workOrder.loading = false;
            state.workOrder.data = action.payload;
        })
        .addCase(assignWorkOrderUsers.rejected, (state, action) => {
            state.workOrder.loading = false;
            state.workOrder.error = action.payload || 'Unknown error';
        })
    }
})

// export const { createWorkOrder, updateWorkOrder, deleteWorkOrder } = WorkOrderSlice.actions;
export default WorkOrderSlice.reducer;