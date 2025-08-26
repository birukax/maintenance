import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FetchParams, type UpdateFormData, type Data, type DataState } from "../types";


interface PurchaseApprovalState {
    purchaseApprovals: DataState<Data[]>;
    purchaseApproval: DataState<Data | null>;
}

const initialState: PurchaseApprovalState = {
    purchaseApprovals: { data: [], loading: false, error: null },
    purchaseApproval: { data: null, loading: false, error: null },
};

export const fetchPurchaseApprovals = createAsyncThunk<Data[], FetchParams, { rejectValue: any }>(
    'purchaseApproval/fetchPurchaseApprovals',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/approval/purchase-approvals/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch Purchase Approvals');
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const fetchPurchaseApproval = createAsyncThunk<Data, number | string, { rejectValue: any }>(
    'purchaseApproval/fetchPurchaseApproval',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/approval/purchase-approvals/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch purchase approval.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const approvePurchaseApproval = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'purchaseApproval/approvePurchaseApproval',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/approval/purchase-approvals/${id}/approve/`, formData)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to approve purchase approval.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const rejectPurchaseApproval = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'purchaseApproval/rejectPurchaseApproval',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/approval/purchase-approvals/${id}/reject/`, formData)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to reject purchase approval.');
            }
            return rejectWithValue('An error occured');
        }
    }
)


const purchaseApprovalSlice = createSlice({
    name: 'purchaseApproval',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchPurchaseApprovals.pending, (state) => {
                state.purchaseApprovals.loading = true;
                state.purchaseApprovals.error = null;
            })
            .addCase(fetchPurchaseApprovals.fulfilled, (state, action: PayloadAction<Data[]>) => {
                state.purchaseApprovals.loading = false;
                state.purchaseApprovals.data = action.payload;
            })
            .addCase(fetchPurchaseApprovals.rejected, (state, action) => {
                state.purchaseApprovals.loading = false;
                state.purchaseApprovals.error = action.payload || 'Unknown error';
            })
            .addCase(fetchPurchaseApproval.pending, (state) => {
                state.purchaseApproval.loading = true;
                state.purchaseApproval.error = null;
            })
            .addCase(fetchPurchaseApproval.fulfilled, (state, action: PayloadAction<Data>) => {
                state.purchaseApproval.loading = false;
                state.purchaseApproval.data = action.payload;
            })
            .addCase(fetchPurchaseApproval.rejected, (state, action) => {
                state.purchaseApproval.loading = false;
                state.purchaseApproval.error = action.payload || 'Unknown error';
            })
            .addCase(approvePurchaseApproval.pending, (state) => {
                state.purchaseApproval.loading = true;
                state.purchaseApproval.error = null;
            })
            .addCase(approvePurchaseApproval.fulfilled, (state, action: PayloadAction<Data>) => {
                state.purchaseApproval.loading = false;
                state.purchaseApproval.data = action.payload;
            })
            .addCase(approvePurchaseApproval.rejected, (state, action) => {
                state.purchaseApproval.loading = false;
                state.purchaseApproval.error = action.payload || 'Unknown error';
            })
            .addCase(rejectPurchaseApproval.pending, (state) => {
                state.purchaseApproval.loading = true;
                state.purchaseApproval.error = null;
            })
            .addCase(rejectPurchaseApproval.fulfilled, (state, action: PayloadAction<Data>) => {
                state.purchaseApproval.loading = false;
                state.purchaseApproval.data = action.payload;
            })
            .addCase(rejectPurchaseApproval.rejected, (state, action) => {
                state.purchaseApproval.loading = false;
                state.purchaseApproval.error = action.payload || 'Unknown error';
            })
    }
})

// export const { approvePurchaseApproval, rejectPurchaseApproval, deletePurchaseApproval } = purchaseApprovalSlice.actions;
export default purchaseApprovalSlice.reducer;