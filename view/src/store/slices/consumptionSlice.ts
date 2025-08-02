import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface ConsumptionState {
    consumptions: DataState;
    consumption: DataState;
}

const initialState: ConsumptionState = {
    consumptions: { data: [], loading: false, error: null },
    consumption: { data: [], loading: false, error: null },
};

export const fetchConsumptions = createAsyncThunk<[], { params: null }, { rejectValue: string }>(
    'consumption/fetchConsumptions',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/inventory/consumptions/', { params });
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch consumptions');
        }
    }
)


export const fetchConsumption = createAsyncThunk<[], number, { rejectValue: string }>(
    'consumption/fetchConsumption',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/inventory/consumptions/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const createConsumption = createAsyncThunk<[], formData, { rejectValue: string }>(
    'consumption/createConsumption',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/inventory/consumptions/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const updateConsumption = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'consumption/updateConsumption',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/inventory/consumptions/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
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
            .addCase(fetchConsumptions.fulfilled, (state, action: PayloadAction<[]>) => {
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
            .addCase(fetchConsumption.fulfilled, (state, action: PayloadAction<[]>) => {
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
            .addCase(createConsumption.fulfilled, (state, action: PayloadAction<[]>) => {
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
            .addCase(updateConsumption.fulfilled, (state, action: PayloadAction<[]>) => {
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