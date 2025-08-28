import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState, PaginatedData } from "../types";

interface BreakdownState {
    breakdowns: DataState<PaginatedData<Data[]> | Data[] | []>;
    breakdown: DataState<Data | null>;
}

const initialState: BreakdownState = {
    breakdowns: { data: [], loading: false, error: null },
    breakdown: { data: null, loading: false, error: null },
};

export const fetchBreakdowns = createAsyncThunk<PaginatedData<Data[]>, FetchParams, { rejectValue: any }>(
    'breakdown/fetchBreakdowns',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/breakdown/breakdowns/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch breakdowns');
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const fetchBreakdown = createAsyncThunk<Data, number | string, { rejectValue: any }>(
    'breakdown/fetchBreakdown',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/breakdown/breakdowns/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch breakdown.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const createBreakdown = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'breakdown/createBreakdown',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/breakdown/breakdowns/', formData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to create breakdown.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const updateBreakdown = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'breakdown/updateBreakdown',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/breakdown/breakdowns/${id}/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to update breakdown.');
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const createBreakdownWorkOrder = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'breakdown/createBreakdownWorkOrder',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/breakdown/breakdowns/${id}/create_work_order/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || { message: 'Failed to create breakdown work order.' });
            }
            return rejectWithValue('An error occured');
        }
    }
)



const breakdownSlice = createSlice({
    name: 'breakdown',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchBreakdowns.pending, (state) => {
                state.breakdowns.loading = true;
                state.breakdowns.error = null;
            })
            .addCase(fetchBreakdowns.fulfilled, (state, action: PayloadAction<PaginatedData<Data[]>>) => {
                state.breakdowns.loading = false;
                state.breakdowns.data = action.payload;
            })
            .addCase(fetchBreakdowns.rejected, (state, action) => {
                state.breakdowns.loading = false;
                state.breakdowns.error = action.payload || 'Unknown error';
            })
            .addCase(fetchBreakdown.pending, (state) => {
                state.breakdown.loading = true;
                state.breakdown.error = null;
            })
            .addCase(fetchBreakdown.fulfilled, (state, action: PayloadAction<Data>) => {
                state.breakdown.loading = false;
                state.breakdown.data = action.payload;
            })
            .addCase(fetchBreakdown.rejected, (state, action) => {
                state.breakdown.loading = false;
                state.breakdown.error = action.payload || 'Unknown error';
            })
            .addCase(createBreakdown.pending, (state) => {
                state.breakdown.loading = true;
                state.breakdown.error = null;
            })
            .addCase(createBreakdown.fulfilled, (state, action: PayloadAction<Data>) => {
                state.breakdown.loading = false;
                state.breakdown.data = action.payload;
            })
            .addCase(createBreakdown.rejected, (state, action) => {
                state.breakdown.loading = false;
                state.breakdown.error = action.payload || 'Unknown error';
            })
            .addCase(updateBreakdown.pending, (state) => {
                state.breakdown.loading = true;
                state.breakdown.error = null;
            })
            .addCase(updateBreakdown.fulfilled, (state, action: PayloadAction<Data>) => {
                state.breakdown.loading = false;
                state.breakdown.data = action.payload;
            })
            .addCase(updateBreakdown.rejected, (state, action) => {
                state.breakdown.loading = false;
                state.breakdown.error = action.payload || 'Unknown error';
            })
            .addCase(createBreakdownWorkOrder.pending, (state) => {
                state.breakdown.loading = true;
                state.breakdown.error = null;
            })
            .addCase(createBreakdownWorkOrder.fulfilled, (state, action: PayloadAction<Data>) => {
                state.breakdown.loading = false;
                state.breakdown.data = action.payload;
            })
            .addCase(createBreakdownWorkOrder.rejected, (state, action) => {
                state.breakdown.loading = false;
                state.breakdown.error = action.payload || 'Unknown error';
            })
    }
})

// export const { createBreakdown, updateBreakdown, deleteBreakdown } = breakdownSlice.actions;
export default breakdownSlice.reducer;