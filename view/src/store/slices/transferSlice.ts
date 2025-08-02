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
    transferHistories: DataState;
}

const initialState: TransferState = {
    transfers: { data: [], loading: false, error: null },
    transfer: { data: [], loading: false, error: null },
    transferHistories: { data: [], loading: false, error: null },
};

export const fetchTransfers = createAsyncThunk<[], { params: null }, { rejectValue: string }>(
    'transfer/fetchTransfers',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/inventory/transfers/', { params });
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch Transfers');
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
            return rejectWithValue(error.response?.data || 'Failed to fetch Transfer');
        }
    }
)

export const createTransfer = createAsyncThunk<[], formData, { rejectValue: string }>(
    'transfer/createTransfer',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/inventory/transfers/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to create Transfer');
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
            return rejectWithValue(error.response?.data || 'Failed to update Transfer');
        }
    }
)
export const receiveTransfer = createAsyncThunk<[], { id: string }, { rejectValue: string }>(
    'transfer/receive',
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/inventory/transfers/${id}/receive/`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to Receive Transfer');
        }
    }
)
export const shipTransfer = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(

    'transfer/ship',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/inventory/transfers/${id}/ship/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to ship Transfer');
        }
    }
)

export const fetchTransferHistories = createAsyncThunk<[], { params: null }, { rejectValue: string }>(
    'transfer/fetchTransferHistories',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/inventory/transfer-histories/', { params });
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch Transfer histories');
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
            .addCase(receiveTransfer.pending, (state) => {
                state.transfer.loading = true;
                state.transfer.error = null;
            })
            .addCase(receiveTransfer.fulfilled, (state, action: PayloadAction<[]>) => {
                state.transfer.loading = false;
                state.transfer.data = action.payload;
            })
            .addCase(receiveTransfer.rejected, (state, action) => {
                state.transfer.loading = false;
                state.transfer.error = action.payload || 'Unknown error';
            })
            .addCase(shipTransfer.pending, (state) => {
                state.transfer.loading = true;
                state.transfer.error = null;
            })
            .addCase(shipTransfer.fulfilled, (state, action: PayloadAction<[]>) => {
                state.transfer.loading = false;
                state.transfer.data = action.payload;
            })
            .addCase(shipTransfer.rejected, (state, action) => {
                state.transfer.loading = false;
                state.transfer.error = action.payload || 'Unknown error';
            })
            .addCase(fetchTransferHistories.pending, (state) => {
                state.transferHistories.loading = true;
                state.transferHistories.error = null;
            })
            .addCase(fetchTransferHistories.fulfilled, (state, action: PayloadAction<[]>) => {
                state.transferHistories.loading = false;
                state.transferHistories.data = action.payload;
            })
            .addCase(fetchTransferHistories.rejected, (state, action) => {
                state.transferHistories.loading = false;
                state.transferHistories.error = action.payload || 'Unknown error';
            })
    }
})

// export const { createTransfer, updateTransfer, deleteTransfer } = TransferSlice.actions;
export default TransferSlice.reducer;