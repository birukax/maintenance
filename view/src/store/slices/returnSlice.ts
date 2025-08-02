import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface ReturnState {
    returns: DataState;
    return: DataState;
}

const initialState: ReturnState = {
    returns: { data: [], loading: false, error: null },
    return: { data: [], loading: false, error: null },
};

export const fetchReturns = createAsyncThunk<[], { params: null }, { rejectValue: string }>(
    'return/fetchReturns',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/inventory/returns/', { params });
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch returns');
        }
    }
)


export const fetchReturn = createAsyncThunk<[], number, { rejectValue: string }>(
    'return/fetchReturn',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/inventory/returns/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const createReturn = createAsyncThunk<[], formData, { rejectValue: string }>(
    'return/createReturn',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/inventory/returns/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const updateReturn = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'return/updateReturn',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/inventory/returns/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)


const returnSlice = createSlice({
    name: 'return',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchReturns.pending, (state) => {
                state.returns.loading = true;
                state.returns.error = null;
            })
            .addCase(fetchReturns.fulfilled, (state, action: PayloadAction<[]>) => {
                state.returns.loading = false;
                state.returns.data = action.payload;
            })
            .addCase(fetchReturns.rejected, (state, action) => {
                state.returns.loading = false;
                state.returns.error = action.payload || 'Unknown error';
            })
            .addCase(fetchReturn.pending, (state) => {
                state.return.loading = true;
                state.return.error = null;
            })
            .addCase(fetchReturn.fulfilled, (state, action: PayloadAction<[]>) => {
                state.return.loading = false;
                state.return.data = action.payload;
            })
            .addCase(fetchReturn.rejected, (state, action) => {
                state.return.loading = false;
                state.return.error = action.payload || 'Unknown error';
            })
            .addCase(createReturn.pending, (state) => {
                state.return.loading = true;
                state.return.error = null;
            })
            .addCase(createReturn.fulfilled, (state, action: PayloadAction<[]>) => {
                state.return.loading = false;
                state.return.data = action.payload;
            })
            .addCase(createReturn.rejected, (state, action) => {
                state.return.loading = false;
                state.return.error = action.payload || 'Unknown error';
            })
            .addCase(updateReturn.pending, (state) => {
                state.return.loading = true;
                state.return.error = null;
            })
            .addCase(updateReturn.fulfilled, (state, action: PayloadAction<[]>) => {
                state.return.loading = false;
                state.return.data = action.payload;
            })
            .addCase(updateReturn.rejected, (state, action) => {
                state.return.loading = false;
                state.return.error = action.payload || 'Unknown error';
            })
    }
})

// export const { createReturn, updateReturn, deleteReturn } = returnSlice.actions;
export default returnSlice.reducer;