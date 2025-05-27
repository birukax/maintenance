import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface TransferState {
    transfers: DataState;
    transfer: DataState;
}

const initialState: TransferState = {
    transfers: {data: [], loading: false, error: null},
    transfer: {data: [], loading: false, error: null},
};

export const fetchTransfers = createAsyncThunk<[], {params:null}, {rejectValue: string}>(
    'transfer/fetchTransfers',
    async(params, {rejectWithValue }) => {
        try {
            const response = await api.get('/inventory/transfers/',{params});
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch work orders');
        }
    }
)


export const fetchTransfer = createAsyncThunk<[], number, { rejectValue: string }>(
    'transfer/fetchTransfer',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/inventory/transfers/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch work order');
        }
    }
)

export const createTransfer = createAsyncThunk<[],  formData  , { rejectValue: string }>(
    'transfer/createTransfer',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/inventory/transfers/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to create work order');
        }
    }
)

export const updateTransfer = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'transfer/updateTransfer',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/inventory/transfers/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update work order');
        }
    }
)

export const createTransferActivities = createAsyncThunk<[],{ id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'transfer/createTransferActivities',
    async ({ id, formData }, { rejectWithValue}) => {
        try {
            const response = await api.post(`/inventory/transfers/${id}/create_activities/`, formData)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to create work order activities');
        }
    }
)

export const assignTransferUsers = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'transfer/assignTransferUsers',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/inventory/transfers/${id}/assign_users/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)
export const submitTransfer = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'transfer/submitTransfer',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/inventory/transfers/${id}/submit_work_order/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)


const TransferSlice = createSlice({
    name: 'transfer',
    initialState,
    reducers: {},
    
    extraReducers: (builder) => {
        builder
        .addCase(fetchTransfers.pending, (state) => {
            state.transfers.loading = true;
            state.transfers.error = null;
        })
        .addCase(fetchTransfers.fulfilled, (state, action: PayloadAction<[]>) => {
            state.transfers.loading = false;
            state.transfers.data = action.payload;
        })
        .addCase(fetchTransfers.rejected, (state, action) => {
            state.transfers.loading = false;
            state.transfers.error = action.payload || 'Unknown error';
        })
        .addCase(fetchTransfer.pending, (state) => {
            state.transfer.loading = true;
            state.transfer.error = null;
        })
        .addCase(fetchTransfer.fulfilled, (state, action: PayloadAction<[]>) => {
            state.transfer.loading = false;
            state.transfer.data = action.payload;
        })
        .addCase(fetchTransfer.rejected, (state, action) => {
            state.transfer.loading = false;
            state.transfer.error = action.payload || 'Unknown error';
        })
        .addCase(createTransfer.pending, (state) => {
            state.transfer.loading = true;
            state.transfer.error = null;
        })
        .addCase(createTransfer.fulfilled, (state, action: PayloadAction<[]>) => {
            state.transfer.loading = false;
            state.transfer.data = action.payload;
        })
        .addCase(createTransfer.rejected, (state, action) => {
            state.transfer.loading = false;
            state.transfer.error = action.payload || 'Unknown error';
        })
        .addCase(updateTransfer.pending, (state) => {
            state.transfer.loading = true;
            state.transfer.error = null;
        })
        .addCase(updateTransfer.fulfilled, (state, action: PayloadAction<[]>) => {
            state.transfer.loading = false;
            state.transfer.data = action.payload;
        })
        .addCase(updateTransfer.rejected, (state, action) => {
            state.transfer.loading = false;
            state.transfer.error = action.payload || 'Unknown error';
        })
        .addCase(createTransferActivities.pending, (state) => {
            state.transfer.loading = true;
            state.transfer.error = null;
        })
        .addCase(createTransferActivities.fulfilled, (state, action: PayloadAction<[]>) => {
            state.transfer.loading = false;
            state.transfer.data = action.payload;
        })
        .addCase(createTransferActivities.rejected, (state, action) => {
            state.transfer.loading = false;
            state.transfer.error = action.payload || 'Unknown error';
        })
        .addCase(assignTransferUsers.pending, (state) => {
            state.transfer.loading = true;
            state.transfer.error = null;
        })
        .addCase(assignTransferUsers.fulfilled, (state, action: PayloadAction<[]>) => {
            state.transfer.loading = false;
            state.transfer.data = action.payload;
        })
        .addCase(assignTransferUsers.rejected, (state, action) => {
            state.transfer.loading = false;
            state.transfer.error = action.payload || 'Unknown error';
        })
        .addCase(submitTransfer.pending, (state) => {
            state.transfer.loading = true;
            state.transfer.error = null;
        })
        .addCase(submitTransfer.fulfilled, (state, action: PayloadAction<[]>) => {
            state.transfer.loading = false;
            state.transfer.data = action.payload;
        })
        .addCase(submitTransfer.rejected, (state, action) => {
            state.transfer.loading = false;
            state.transfer.error = action.payload || 'Unknown error';
        })
    }
})

// export const { createTransfer, updateTransfer, deleteTransfer } = TransferSlice.actions;
export default TransferSlice.reducer;