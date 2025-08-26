import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FetchParams, type UpdateFormData, type Data, type DataState } from "../types";

interface TransferApprovalState {
    transferApprovals: DataState<Data[]>;
    transferApproval: DataState<Data | null>;
}

const initialState: TransferApprovalState = {
    transferApprovals: { data: [], loading: false, error: null },
    transferApproval: { data: null, loading: false, error: null },
};

export const fetchTransferApprovals = createAsyncThunk<Data[], FetchParams, { rejectValue: any }>(
    'transferApproval/fetchTransferApprovals',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/approval/transfer-approvals/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch transfer approvals.');
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const fetchTransferApproval = createAsyncThunk<Data, number | string, { rejectValue: any }>(
    'transferApproval/fetchTransferApproval',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/approval/transfer-approvals/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch transfer approval.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const approveTransferApproval = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'transferApproval/approveTransferApproval',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/approval/transfer-approvals/${id}/approve/`, formData)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to approve transfer approval.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const rejectTransferApproval = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'transferApproval/rejectTransferApproval',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/approval/transfer-approvals/${id}/reject/`, formData)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to reject transfer approval.');
            }
            return rejectWithValue('An error occured');
        }
    }
)


const transferApprovalSlice = createSlice({
    name: 'transferApproval',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchTransferApprovals.pending, (state) => {
                state.transferApprovals.loading = true;
                state.transferApprovals.error = null;
            })
            .addCase(fetchTransferApprovals.fulfilled, (state, action: PayloadAction<Data[]>) => {
                state.transferApprovals.loading = false;
                state.transferApprovals.data = action.payload;
            })
            .addCase(fetchTransferApprovals.rejected, (state, action) => {
                state.transferApprovals.loading = false;
                state.transferApprovals.error = action.payload || 'Unknown error';
            })
            .addCase(fetchTransferApproval.pending, (state) => {
                state.transferApproval.loading = true;
                state.transferApproval.error = null;
            })
            .addCase(fetchTransferApproval.fulfilled, (state, action: PayloadAction<Data>) => {
                state.transferApproval.loading = false;
                state.transferApproval.data = action.payload;
            })
            .addCase(fetchTransferApproval.rejected, (state, action) => {
                state.transferApproval.loading = false;
                state.transferApproval.error = action.payload || 'Unknown error';
            })
            .addCase(approveTransferApproval.pending, (state) => {
                state.transferApproval.loading = true;
                state.transferApproval.error = null;
            })
            .addCase(approveTransferApproval.fulfilled, (state, action: PayloadAction<Data>) => {
                state.transferApproval.loading = false;
                state.transferApproval.data = action.payload;
            })
            .addCase(approveTransferApproval.rejected, (state, action) => {
                state.transferApproval.loading = false;
                state.transferApproval.error = action.payload || 'Unknown error';
            })
            .addCase(rejectTransferApproval.pending, (state) => {
                state.transferApproval.loading = true;
                state.transferApproval.error = null;
            })
            .addCase(rejectTransferApproval.fulfilled, (state, action: PayloadAction<Data>) => {
                state.transferApproval.loading = false;
                state.transferApproval.data = action.payload;
            })
            .addCase(rejectTransferApproval.rejected, (state, action) => {
                state.transferApproval.loading = false;
                state.transferApproval.error = action.payload || 'Unknown error';
            })
    }
})

// export const { approveTransferApproval, rejectTransferApproval, deleteTransferApproval } = transferApprovalSlice.actions;
export default transferApprovalSlice.reducer;