import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface PurchaseRequestState {
    purchaseRequests: DataState;
    purchaseRequest: DataState;
}

const initialState: PurchaseRequestState = {
    purchaseRequests: {data: null, loading: false, error: null},
    purchaseRequest: {data: null, loading: false, error: null},
};

export const fetchPurchaseRequests = createAsyncThunk<[], {params:null}, {rejectValue: string}>(
    'purchaseRequest/fetchPurchaseRequests',
    async(params, {rejectWithValue }) => {
        try {
            const response = await api.get('/purchase/requests/',{params});
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch Purchase Requests');
        }
    }
)


export const fetchPurchaseRequest = createAsyncThunk<[], number, { rejectValue: string }>(
    'purchaseRequest/fetchPurchaseRequest',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/purchase/requests/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch Purchase Request');
        }
    }
)

export const createPurchaseRequest = createAsyncThunk<[],  formData  , { rejectValue: string }>(
    'purchaseRequest/createPurchaseRequest',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/purchase/requests/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to create Purchase Request');
        }
    }
)

export const updatePurchaseRequest = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'purchaseRequest/updatePurchaseRequest',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/purchase/requests/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update Purchase Request');
        }
    }
)

export const receivePurchaseRequest = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'purchaseRequest/receivePurchaseRequest',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/purchase/requests/${id}/receive/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to receive Purchase Request');
        }
    }
)



const purchaseRequestSlice = createSlice({
    name: 'purchaseRequest',
    initialState,
    reducers: {},
    
    extraReducers: (builder) => {
        builder
        .addCase(fetchPurchaseRequests.pending, (state) => {
            state.purchaseRequests.loading = true;
            state.purchaseRequests.error = null;
        })
        .addCase(fetchPurchaseRequests.fulfilled, (state, action: PayloadAction<[]>) => {
            state.purchaseRequests.loading = false;
            state.purchaseRequests.data = action.payload;
        })
        .addCase(fetchPurchaseRequests.rejected, (state, action) => {
            state.purchaseRequests.loading = false;
            state.purchaseRequests.error = action.payload || 'Unknown error';
        })
        .addCase(fetchPurchaseRequest.pending, (state) => {
                        state.purchaseRequest.loading = true;
                        state.purchaseRequest.error = null;
                    })
                    .addCase(fetchPurchaseRequest.fulfilled, (state, action: PayloadAction<[]>) => {
                        state.purchaseRequest.loading = false;
                        state.purchaseRequest.data = action.payload;
                    })
                    .addCase(fetchPurchaseRequest.rejected, (state, action) => {
                        state.purchaseRequest.loading = false;
                        state.purchaseRequest.error = action.payload || 'Unknown error';
                    })
                    .addCase(createPurchaseRequest.pending, (state) => {
                        state.purchaseRequest.loading = true;
                        state.purchaseRequest.error = null;
                    })
                    .addCase(createPurchaseRequest.fulfilled, (state, action: PayloadAction<[]>) => {
                        state.purchaseRequest.loading = false;
                        state.purchaseRequest.data = action.payload;
                    })
                    .addCase(createPurchaseRequest.rejected, (state, action) => {
                        state.purchaseRequest.loading = false;
                        state.purchaseRequest.error = action.payload || 'Unknown error';
                    })
                    .addCase(updatePurchaseRequest.pending, (state) => {
                        state.purchaseRequest.loading = true;
                        state.purchaseRequest.error = null;
                    })
                    .addCase(updatePurchaseRequest.fulfilled, (state, action: PayloadAction<[]>) => {
                        state.purchaseRequest.loading = false;
                        state.purchaseRequest.data = action.payload;
                    })
                    .addCase(updatePurchaseRequest.rejected, (state, action) => {
                        state.purchaseRequest.loading = false;
                        state.purchaseRequest.error = action.payload || 'Unknown error';
                    })
                    .addCase(receivePurchaseRequest.pending, (state) => {
                        state.purchaseRequest.loading = true;
                        state.purchaseRequest.error = null;
                    })
                    .addCase(receivePurchaseRequest.fulfilled, (state, action: PayloadAction<[]>) => {
                        state.purchaseRequest.loading = false;
                        state.purchaseRequest.data = action.payload;
                    })
                    .addCase(receivePurchaseRequest.rejected, (state, action) => {
                        state.purchaseRequest.loading = false;
                        state.purchaseRequest.error = action.payload || 'Unknown error';
                    })
    }
})

// export const { createPurchaseRequest, updatePurchaseRequest, deletePurchaseRequest } = purchaseRequestSlice.actions;
export default purchaseRequestSlice.reducer;