import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState, PaginatedData } from "../types";


interface WorkOrderState {
    workOrders: DataState<PaginatedData<Data[]> | Data[] | []>;
    workOrder: DataState<Data | null>;
}

const initialState: WorkOrderState = {
    workOrders: { data: [], loading: false, error: null },
    workOrder: { data: null, loading: false, error: null },
};

export const fetchWorkOrders = createAsyncThunk<PaginatedData<Data[]>, FetchParams, { rejectValue: any }>(
    'workOrder/fetchWorkOrders',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/work-order/work-orders/', { params });
            return response.data;
        }
        catch (error) {

            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch work orders');
            }
            return rejectWithValue('An error occured')
        }
    }
)


export const fetchWorkOrder = createAsyncThunk<Data, number | string, { rejectValue: any }>(
    'workOrder/fetchWorkOrder',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/work-order/work-orders/${id}/`)
            return response.data;
        }
        catch (error) {

            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch work order');
            }
            return rejectWithValue('An error occured')
        }
    }
)

export const createWorkOrder = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'workOrder/createWorkOrder',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/work-order/work-orders/', formData);
            return response.data;
        }
        catch (error) {

            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to create work order');
            }
            return rejectWithValue('An error occured')
        }
    }
)

export const updateWorkOrder = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'workOrder/updateWorkOrder',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/work-order/work-orders/${id}/`, formData);
            return response.data;
        } catch (error) {

            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to update work order');
            }
            return rejectWithValue('An error occured')
        }
    }
)

export const createWorkOrderActivities = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'workOrder/createWorkOrderActivities',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/work-order/work-orders/${id}/create_activities/`, formData)
            return response.data;
        } catch (error) {

            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to create work order activities');
            }
            return rejectWithValue('An error occured')
        }
    }
)

export const assignWorkOrderUsers = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'workOrder/assignWorkOrderUsers',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/work-order/work-orders/${id}/assign_users/`, formData);
            return response.data;
        } catch (error) {

            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to assign users to work order.');
            }
            return rejectWithValue('An error occured')
        }
    }
)

export const submitWorkOrder = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'workOrder/submitWorkOrder',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/work-order/work-orders/${id}/submit_work_order/`, formData);
            return response.data;
        } catch (error) {

            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to submit work order.');
            }
            return rejectWithValue('An error occured')
        }
    }
)


export const completeWorkOrder = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'workOrder/completeWorkOrder',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/work-order/work-orders/${id}/complete_work_order/`, formData);
            return response.data;
        } catch (error) {

            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to complete work order.');
            }
            return rejectWithValue('An error occured')
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
            .addCase(fetchWorkOrders.fulfilled, (state, action: PayloadAction<PaginatedData<Data[]>>) => {
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
            .addCase(fetchWorkOrder.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(createWorkOrder.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(updateWorkOrder.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(createWorkOrderActivities.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(assignWorkOrderUsers.fulfilled, (state, action: PayloadAction<Data>) => {
                state.workOrder.loading = false;
                state.workOrder.data = action.payload;
            })
            .addCase(assignWorkOrderUsers.rejected, (state, action) => {
                state.workOrder.loading = false;
                state.workOrder.error = action.payload || 'Unknown error';
            })
            .addCase(submitWorkOrder.pending, (state) => {
                state.workOrder.loading = true;
                state.workOrder.error = null;
            })
            .addCase(submitWorkOrder.fulfilled, (state, action: PayloadAction<Data>) => {
                state.workOrder.loading = false;
                state.workOrder.data = action.payload;
            })
            .addCase(submitWorkOrder.rejected, (state, action) => {
                state.workOrder.loading = false;
                state.workOrder.error = action.payload || 'Unknown error';
            })
            .addCase(completeWorkOrder.pending, (state) => {
                state.workOrder.loading = true;
                state.workOrder.error = null;
            })
            .addCase(completeWorkOrder.fulfilled, (state, action: PayloadAction<Data>) => {
                state.workOrder.loading = false;
                state.workOrder.data = action.payload;
            })
            .addCase(completeWorkOrder.rejected, (state, action) => {
                state.workOrder.loading = false;
                state.workOrder.error = action.payload || 'Unknown error';
            })
    }
})

// export const { createWorkOrder, updateWorkOrder, deleteWorkOrder } = WorkOrderSlice.actions;
export default WorkOrderSlice.reducer;