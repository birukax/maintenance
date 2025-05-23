import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface WorkOrderTypeState {
    workOrderTypes: DataState;
    workOrderType: DataState;
}

const initialState: WorkOrderTypeState = {
    workOrderTypes: {data: [], loading: false, error: null},
    workOrderType: {data: [], loading: false, error: null},
};

export const fetchWorkOrderTypes = createAsyncThunk<[], {params:null}, {rejectValue: string}>(
    'workOrderType/fetchWorkOrderTypes',
    async(params, {rejectWithValue }) => {
        try {
            const response = await api.get('/work-order/work-order-types/',{params});
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch work order types');
        }
    }
)


export const fetchWorkOrderType = createAsyncThunk<[], number, { rejectValue: string }>(
    'workOrderType/fetchWorkOrderType',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/work-order/work-order-types/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch work order type');
        }
    }
)

export const createWorkOrderType = createAsyncThunk<[],  formData  , { rejectValue: string }>(
    'workOrderType/createWorkOrderType',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/work-order/work-order-types/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to create work order type');
        }
    }
)

export const updateWorkOrderType = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'workOrderType/updateWorkOrderType',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/work-order/work-order-types/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update work order type');
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
        .addCase(fetchWorkOrderTypes.fulfilled, (state, action: PayloadAction<[]>) => {
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
        .addCase(fetchWorkOrderType.fulfilled, (state, action: PayloadAction<[]>) => {
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
        .addCase(createWorkOrderType.fulfilled, (state, action: PayloadAction<[]>) => {
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
        .addCase(updateWorkOrderType.fulfilled, (state, action: PayloadAction<[]>) => {
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