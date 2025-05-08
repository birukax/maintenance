import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface BreakdownState {
    breakdowns: DataState;
    breakdown: DataState;
}

const initialState: BreakdownState = {
    breakdowns: {data: null, loading: false, error: null},
    breakdown: {data: null, loading: false, error: null},
};

export const fetchBreakdowns = createAsyncThunk<[], {params:null}, {rejectValue: string}>(
    'breakdown/fetchBreakdowns',
    async(params, {rejectWithValue }) => {
        try {
            const response = await api.get('/breakdown/breakdowns/',{params});
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch breakdowns');
        }
    }
)


export const fetchBreakdown = createAsyncThunk<[], number, { rejectValue: string }>(
    'breakdown/fetchBreakdown',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/breakdown/breakdowns/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const createBreakdown = createAsyncThunk<[],  formData  , { rejectValue: string }>(
    'breakdown/createBreakdown',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/breakdown/breakdowns/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const updateBreakdown = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'breakdown/updateBreakdown',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/breakdown/breakdowns/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)


export const createBreakdownWorkOrder = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'breakdown/createBreakdownWorkOrder',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/breakdown/breakdowns/${id}/create_work_order/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue( error.response?.data || {message: 'Failed to create work order.'});
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
        .addCase(fetchBreakdowns.fulfilled, (state, action: PayloadAction<[]>) => {
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
        .addCase(fetchBreakdown.fulfilled, (state, action: PayloadAction<[]>) => {
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
        .addCase(createBreakdown.fulfilled, (state, action: PayloadAction<[]>) => {
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
        .addCase(updateBreakdown.fulfilled, (state, action: PayloadAction<[]>) => {
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
        .addCase(createBreakdownWorkOrder.fulfilled, (state, action: PayloadAction<[]>) => {
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