import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState } from "../types";

interface PurchaseRequestState {
    purchaseRequests: DataState<Data[]>;
    purchaseRequest: DataState<Data | null>;
}

const initialState: PurchaseRequestState = {
    purchaseRequests: { data: [], loading: false, error: null },
    purchaseRequest: { data: null, loading: false, error: null },
};

export const fetchPurchaseRequests = createAsyncThunk<Data[], FetchParams, { rejectValue: any }>(
    'purchaseRequest/fetchPurchaseRequests',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/purchase/requests/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch Purchase Requests');
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const fetchPurchaseRequest = createAsyncThunk<Data, number | string, { rejectValue: any }>(
    'purchaseRequest/fetchPurchaseRequest',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/purchase/requests/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch Purchase Request');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const createPurchaseRequest = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'purchaseRequest/createPurchaseRequest',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/purchase/requests/', formData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to create Purchase Request');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const updatePurchaseRequest = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'purchaseRequest/updatePurchaseRequest',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/purchase/requests/${id}/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to update Purchase Request');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const receivePurchaseRequest = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'purchaseRequest/receivePurchaseRequest',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/purchase/requests/${id}/receive/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to receive Purchase Request');
            }
            return rejectWithValue('An error occured');
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
            .addCase(fetchPurchaseRequests.fulfilled, (state, action: PayloadAction<Data[]>) => {
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
            .addCase(fetchPurchaseRequest.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(createPurchaseRequest.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(updatePurchaseRequest.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(receivePurchaseRequest.fulfilled, (state, action: PayloadAction<Data>) => {
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