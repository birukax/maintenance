import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState } from "../types";


interface TransferState {
    transfers: DataState<Data[]>;
    transfer: DataState<Data | null>;
    transferHistories: DataState<Data[]>;
}

const initialState: TransferState = {
    transfers: { data: [], loading: false, error: null },
    transfer: { data: null, loading: false, error: null },
    transferHistories: { data: [], loading: false, error: null },
};

export const fetchTransfers = createAsyncThunk<Data[], FetchParams, { rejectValue: any }>(
    'transfer/fetchTransfers',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/inventory/transfers/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch Transfers');
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const fetchTransfer = createAsyncThunk<Data, number, { rejectValue: any }>(
    'transfer/fetchTransfer',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/inventory/transfers/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch Transfer');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const createTransfer = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'transfer/createTransfer',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/inventory/transfers/', formData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to create Transfer');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const updateTransfer = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'transfer/updateTransfer',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/inventory/transfers/${id}/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to update Transfer');
            }
            return rejectWithValue('An error occured');
        }
    }
)
export const receiveTransfer = createAsyncThunk<Data, number, { rejectValue: any }>(
    'transfer/receive',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/inventory/transfers/${id}/receive/`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to Receive Transfer');
            }
            return rejectWithValue('An error occured');
        }
    }
)
export const shipTransfer = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(

    'transfer/ship',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/inventory/transfers/${id}/ship/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to ship Transfer');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const fetchTransferHistories = createAsyncThunk<Data[], FetchParams, { rejectValue: any }>(
    'transfer/fetchTransferHistories',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/inventory/transfer-histories/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch Transfer histories');
            }
            return rejectWithValue('An error occured');
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
            .addCase(fetchTransfers.fulfilled, (state, action: PayloadAction<Data[]>) => {
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
            .addCase(fetchTransfer.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(createTransfer.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(updateTransfer.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(receiveTransfer.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(shipTransfer.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(fetchTransferHistories.fulfilled, (state, action: PayloadAction<Data[]>) => {
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