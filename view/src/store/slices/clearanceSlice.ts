import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface Clearance {
    id: number;
    [key: string]: any;
}

interface DataState<T> {
    data: T;
    loading: boolean;
    error: any;
}

interface ClearanceState {
    clearances: DataState<Clearance[]>;
    clearance: DataState<Clearance | null>;
}

const initialState: ClearanceState = {
    clearances: { data: [], loading: false, error: null },
    clearance: { data: null, loading: false, error: null },
};

export const fetchClearances = createAsyncThunk<Clearance[], { params: null | undefined }, { rejectValue: any }>(
    'clearance/fetchClearances',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/work-order/clearances/', { params });
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch clearances');
        }
    }
)


export const fetchClearance = createAsyncThunk<Clearance, number, { rejectValue: any }>(
    'clearance/fetchClearance',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/work-order/clearances/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch clearance.');
        }
    }
)

export const createClearance = createAsyncThunk<Clearance, { [key: string]: any }, { rejectValue: any }>(
    'clearance/createClearance',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/work-order/clearances/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || "Failed to create clearance.");
        }
    }
)

export const updateClearance = createAsyncThunk<Clearance, { id: string, formData: { [key: string] } }, { rejectValue: any }>(
    'clearance/updateClearance',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/work-order/clearances/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update clearance.");
        }
    }
)


const clearanceSlice = createSlice({
    name: 'clearance',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchClearances.pending, (state) => {
                state.clearances.loading = true;
                state.clearances.error = null;
            })
            .addCase(fetchClearances.fulfilled, (state, action: PayloadAction<Clearance[]>) => {
                state.clearances.loading = false;
                state.clearances.data = action.payload;
            })
            .addCase(fetchClearances.rejected, (state, action) => {
                state.clearances.loading = false;
                state.clearances.error = action.payload;
            })
            .addCase(fetchClearance.pending, (state) => {
                state.clearance.loading = true;
                state.clearance.error = null;
            })
            .addCase(fetchClearance.fulfilled, (state, action: PayloadAction<Clearance>) => {
                state.clearance.loading = false;
                state.clearance.data = action.payload;
            })
            .addCase(fetchClearance.rejected, (state, action) => {
                state.clearance.loading = false;
                state.clearance.error = action.payload;
            })
            .addCase(createClearance.pending, (state) => {
                state.clearance.loading = true;
                state.clearance.error = null;
            })
            .addCase(createClearance.fulfilled, (state, action: PayloadAction<Clearance>) => {
                state.clearance.loading = false;
                state.clearance.data = action.payload;
            })
            .addCase(createClearance.rejected, (state, action) => {
                state.clearance.loading = false;
                state.clearance.error = action.payload;
            })
            .addCase(updateClearance.pending, (state) => {
                state.clearance.loading = true;
                state.clearance.error = null;
            })
            .addCase(updateClearance.fulfilled, (state, action: PayloadAction<Clearance>) => {
                state.clearance.loading = false;
                state.clearance.data = action.payload;
            })
            .addCase(updateClearance.rejected, (state, action) => {
                state.clearance.loading = false;
                state.clearance.error = action.payload;
            })
    }
})

// export const { createClearance, updateClearance, deleteSchedule } = clearanceSlice.actions;
export default clearanceSlice.reducer;