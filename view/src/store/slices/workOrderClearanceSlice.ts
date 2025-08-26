import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState } from "../types";

interface WorkOrderClearanceState {
    workOrderClearances: DataState<Data[]>;
    workOrderClearance: DataState<Data | null>;
}

const initialState: WorkOrderClearanceState = {
    workOrderClearances: { data: [], loading: false, error: null },
    workOrderClearance: { data: null, loading: false, error: null },
};

export const fetchWorkOrderClearances = createAsyncThunk<Data[], FetchParams, { rejectValue: any }>(
    'workOrderClearance/fetchWorkOrderClearances',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/work-order/work-order-clearances/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch work order clearances');
            }
            return rejectWithValue('An error occured')
        }
    }
)


export const fetchWorkOrderClearance = createAsyncThunk<Data, number | string, { rejectValue: any }>(
    'workOrderClearance/fetchWorkOrderClearance',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/work-order/work-order-clearances/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch work order clearance');
            }
            return rejectWithValue('An error occured')
        }
    }
)

export const createWorkOrderClearance = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'workOrderClearance/createWorkOrderClearance',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/work-order/work-order-clearances/', formData);
            return response.data;
        }
        catch (error) {

            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to create work order clearance');
            }
            return rejectWithValue('An error occured')
        }
    }
)

export const updateWorkOrderClearance = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'workOrderClearance/updateWorkOrderClearance',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/work-order/work-order-clearances/${id}/`, formData);
            return response.data;
        } catch (error) {

            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to update work order clearance');
            }
            return rejectWithValue('An error occured')
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
            .addCase(fetchWorkOrderClearances.fulfilled, (state, action: PayloadAction<Data[]>) => {
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
            .addCase(fetchWorkOrderClearance.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(createWorkOrderClearance.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(updateWorkOrderClearance.fulfilled, (state, action: PayloadAction<Data>) => {
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