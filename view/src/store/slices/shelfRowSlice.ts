import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface ShelfRowState {
    shelfRows: DataState;
    shelfRow: DataState;
}

const initialState: ShelfRowState = {
    shelfRows: {data: null, loading: false, error: null},
    shelfRow: {data: null, loading: false, error: null},
};

export const fetchShelfRows = createAsyncThunk<[], {params:null}, {rejectValue: string}>(
    'shelfRow/fetchShelfRows',
    async(params, {rejectWithValue }) => {
        try {
            const response = await api.get('/inventory/shelf-rows/',{params});
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch shelfRows');
        }
    }
)


export const fetchShelfRow = createAsyncThunk<[], number, { rejectValue: string }>(
    'shelfRow/fetchShelfRow',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/inventory/shelf-rows/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const createShelfRow = createAsyncThunk<[],  formData  , { rejectValue: string }>(
    'shelfRow/createShelfRow',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/inventory/shelf-rows/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const updateShelfRow = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'shelfRow/updateShelfRow',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/inventory/shelf-rows/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)


const shelfRowSlice = createSlice({
    name: 'shelfRow',
    initialState,
    reducers: {},
    
    extraReducers: (builder) => {
        builder
        .addCase(fetchShelfRows.pending, (state) => {
            state.shelfRows.loading = true;
            state.shelfRows.error = null;
        })
        .addCase(fetchShelfRows.fulfilled, (state, action: PayloadAction<[]>) => {
            state.shelfRows.loading = false;
            state.shelfRows.data = action.payload;
        })
        .addCase(fetchShelfRows.rejected, (state, action) => {
            state.shelfRows.loading = false;
            state.shelfRows.error = action.payload || 'Unknown error';
        })
        .addCase(fetchShelfRow.pending, (state) => {
                        state.shelfRow.loading = true;
                        state.shelfRow.error = null;
                    })
        .addCase(fetchShelfRow.fulfilled, (state, action: PayloadAction<[]>) => {
            state.shelfRow.loading = false;
            state.shelfRow.data = action.payload;
        })
        .addCase(fetchShelfRow.rejected, (state, action) => {
            state.shelfRow.loading = false;
            state.shelfRow.error = action.payload || 'Unknown error';
        })
        .addCase(createShelfRow.pending, (state) => {
            state.shelfRow.loading = true;
            state.shelfRow.error = null;
        })
        .addCase(createShelfRow.fulfilled, (state, action: PayloadAction<[]>) => {
            state.shelfRow.loading = false;
            state.shelfRow.data = action.payload;
        })
        .addCase(createShelfRow.rejected, (state, action) => {
            state.shelfRow.loading = false;
            state.shelfRow.error = action.payload || 'Unknown error';
        })
        .addCase(updateShelfRow.pending, (state) => {
            state.shelfRow.loading = true;
            state.shelfRow.error = null;
        })
        .addCase(updateShelfRow.fulfilled, (state, action: PayloadAction<[]>) => {
            state.shelfRow.loading = false;
            state.shelfRow.data = action.payload;
        })
        .addCase(updateShelfRow.rejected, (state, action) => {
            state.shelfRow.loading = false;
            state.shelfRow.error = action.payload || 'Unknown error';
        })
    }
})

// export const { createShelfRow, updateShelfRow, deleteShelfRow } = shelfRowSlice.actions;
export default shelfRowSlice.reducer;