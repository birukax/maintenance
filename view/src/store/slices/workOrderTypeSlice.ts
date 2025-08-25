import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState } from "../types";


interface WorkOrderTypeState {
    workOrderTypes: DataState<Data[]>;
    workOrderType: DataState<Data | null>;
}

const initialState: WorkOrderTypeState = {
    workOrderTypes: { data: [], loading: false, error: null },
    workOrderType: { data: null, loading: false, error: null },
};

export const fetchWorkOrderTypes = createAsyncThunk<Data[], FetchParams, { rejectValue: any }>(
    'workOrderType/fetchWorkOrderTypes',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/work-order/work-order-types/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch work order types');
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const fetchWorkOrderType = createAsyncThunk<Data, number, { rejectValue: any }>(
    'workOrderType/fetchWorkOrderType',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/work-order/work-order-types/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch work order type');
            }
            return rejectWithValue('An error occured')
        }
    }
)

export const createWorkOrderType = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'workOrderType/createWorkOrderType',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/work-order/work-order-types/', formData);
            return response.data;
        }
        catch (error) {

            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to create work order type');
            }
            return rejectWithValue('An error occured')
        }
    }
)

export const updateWorkOrderType = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'workOrderType/updateWorkOrderType',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/work-order/work-order-types/${id}/`, formData);
            return response.data;
        } catch (error) {

            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to update work order type');
            }
            return rejectWithValue('An error occured')
        }
    }
)


const WorkOrderTypeSlice = createSlice({
    name: 'workOrderType',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchWorkOrderTypes.pending, (state) => {
                state.workOrderTypes.loading = true;
                state.workOrderTypes.error = null;
            })
            .addCase(fetchWorkOrderTypes.fulfilled, (state, action: PayloadAction<Data[]>) => {
                state.workOrderTypes.loading = false;
                state.workOrderTypes.data = action.payload;
            })
            .addCase(fetchWorkOrderTypes.rejected, (state, action) => {
                state.workOrderTypes.loading = false;
                state.workOrderTypes.error = action.payload || 'Unknown error';
            })
            .addCase(fetchWorkOrderType.pending, (state) => {
                state.workOrderType.loading = true;
                state.workOrderType.error = null;
            })
            .addCase(fetchWorkOrderType.fulfilled, (state, action: PayloadAction<Data>) => {
                state.workOrderType.loading = false;
                state.workOrderType.data = action.payload;
            })
            .addCase(fetchWorkOrderType.rejected, (state, action) => {
                state.workOrderType.loading = false;
                state.workOrderType.error = action.payload || 'Unknown error';
            })
            .addCase(createWorkOrderType.pending, (state) => {
                state.workOrderType.loading = true;
                state.workOrderType.error = null;
            })
            .addCase(createWorkOrderType.fulfilled, (state, action: PayloadAction<Data>) => {
                state.workOrderType.loading = false;
                state.workOrderType.data = action.payload;
            })
            .addCase(createWorkOrderType.rejected, (state, action) => {
                state.workOrderType.loading = false;
                state.workOrderType.error = action.payload || 'Unknown error';
            })
            .addCase(updateWorkOrderType.pending, (state) => {
                state.workOrderType.loading = true;
                state.workOrderType.error = null;
            })
            .addCase(updateWorkOrderType.fulfilled, (state, action: PayloadAction<Data>) => {
                state.workOrderType.loading = false;
                state.workOrderType.data = action.payload;
            })
            .addCase(updateWorkOrderType.rejected, (state, action) => {
                state.workOrderType.loading = false;
                state.workOrderType.error = action.payload || 'Unknown error';
            })
    }
})

// export const { createWorkOrderType, updateWorkOrderType, deleteWorkOrderType } = WorkOrderTypeSlice.actions;
export default WorkOrderTypeSlice.reducer;