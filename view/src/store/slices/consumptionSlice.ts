import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState, PaginatedData } from "../types";

interface ConsumptionState {
    consumptions: DataState<PaginatedData<Data[]> | Data[] | []>;
    consumption: DataState<Data | null>;
}

const initialState: ConsumptionState = {
    consumptions: { data: [], loading: false, error: null },
    consumption: { data: null, loading: false, error: null },
};

export const fetchConsumptions = createAsyncThunk<PaginatedData<Data[]>, FetchParams, { rejectValue: any }>(
    'consumption/fetchConsumptions',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/inventory/consumptions/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch consumptions');
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const fetchConsumption = createAsyncThunk<Data, number | string, { rejectValue: any }>(
    'consumption/fetchConsumption',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/inventory/consumptions/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch consumption.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const createConsumption = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'consumption/createConsumption',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/inventory/consumptions/', formData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to create consumption.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const updateConsumption = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'consumption/updateConsumption',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/inventory/consumptions/${id}/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to update consumption.');
            }
            return rejectWithValue('An error occured');
        }
    }
)


const consumptionSlice = createSlice({
    name: 'consumption',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchConsumptions.pending, (state) => {
                state.consumptions.loading = true;
                state.consumptions.error = null;
            })
            .addCase(fetchConsumptions.fulfilled, (state, action: PayloadAction<PaginatedData<Data[]>>) => {
                state.consumptions.loading = false;
                state.consumptions.data = action.payload;
            })
            .addCase(fetchConsumptions.rejected, (state, action) => {
                state.consumptions.loading = false;
                state.consumptions.error = action.payload || 'Unknown error';
            })
            .addCase(fetchConsumption.pending, (state) => {
                state.consumption.loading = true;
                state.consumption.error = null;
            })
            .addCase(fetchConsumption.fulfilled, (state, action: PayloadAction<Data>) => {
                state.consumption.loading = false;
                state.consumption.data = action.payload;
            })
            .addCase(fetchConsumption.rejected, (state, action) => {
                state.consumption.loading = false;
                state.consumption.error = action.payload || 'Unknown error';
            })
            .addCase(createConsumption.pending, (state) => {
                state.consumption.loading = true;
                state.consumption.error = null;
            })
            .addCase(createConsumption.fulfilled, (state, action: PayloadAction<Data>) => {
                state.consumption.loading = false;
                state.consumption.data = action.payload;
            })
            .addCase(createConsumption.rejected, (state, action) => {
                state.consumption.loading = false;
                state.consumption.error = action.payload || 'Unknown error';
            })
            .addCase(updateConsumption.pending, (state) => {
                state.consumption.loading = true;
                state.consumption.error = null;
            })
            .addCase(updateConsumption.fulfilled, (state, action: PayloadAction<Data>) => {
                state.consumption.loading = false;
                state.consumption.data = action.payload;
            })
            .addCase(updateConsumption.rejected, (state, action) => {
                state.consumption.loading = false;
                state.consumption.error = action.payload || 'Unknown error';
            })
    }
})

// export const { createConsumption, updateConsumption, deleteConsumption } = consumptionSlice.actions;
export default consumptionSlice.reducer;