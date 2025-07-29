import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface PurchaseApprovalState {
    purchaseApprovals: DataState;
    purchaseApproval: DataState;
}

const initialState: PurchaseApprovalState = {
    purchaseApprovals: { data: [], loading: false, error: null },
    purchaseApproval: { data: [], loading: false, error: null },
};

export const fetchPurchaseApprovals = createAsyncThunk<[], { params: null }, { rejectValue: string }>(
    'purchaseApproval/fetchPurchaseApprovals',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/approval/purchase-approvals/', { params: params });
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch Purchase Approvals');
        }
    }
)


export const fetchPurchaseApproval = createAsyncThunk<[], number, { rejectValue: string }>(
    'purchaseApproval/fetchPurchaseApproval',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/approval/purchase-approvals/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const approvePurchaseApproval = createAsyncThunk<[], { id, formData }, { rejectValue: string }>(
    'purchaseApproval/approvePurchaseApproval',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/approval/purchase-approvals/${id}/approve/`, formData)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const rejectPurchaseApproval = createAsyncThunk<[], { id, formData }, { rejectValue: string }>(
    'purchaseApproval/rejectPurchaseApproval',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/approval/purchase-approvals/${id}/reject/`, formData)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
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
            .addCase(fetchPurchaseApprovals.fulfilled, (state, action: PayloadAction<[]>) => {
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
            .addCase(fetchPurchaseApproval.fulfilled, (state, action: PayloadAction<[]>) => {
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
            .addCase(approvePurchaseApproval.fulfilled, (state, action: PayloadAction<[]>) => {
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
            .addCase(rejectPurchaseApproval.fulfilled, (state, action: PayloadAction<[]>) => {
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