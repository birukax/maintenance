import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface ShelfBoxestate {
    shelfBoxes: DataState;
    shelfBox: DataState;
}

const initialState: ShelfBoxestate = {
    shelfBoxes: {data: [], loading: false, error: null},
    shelfBox: {data: [], loading: false, error: null},
};

export const fetchShelfBoxes = createAsyncThunk<[], {params:null}, {rejectValue: string}>(
    'shelfBox/fetchShelfBoxes',
    async(params, {rejectWithValue }) => {
        try {
            const response = await api.get('/inventory/shelf-boxes/',{params});
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch shelfBoxes');
        }
    }
)


export const fetchShelfBox = createAsyncThunk<[], number, { rejectValue: string }>(
    'shelfBox/fetchShelfBox',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/inventory/shelf-boxes/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const createShelfBox = createAsyncThunk<[],  formData  , { rejectValue: string }>(
    'shelfBox/createShelfBox',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/inventory/shelf-boxes/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const updateShelfBox = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'shelfBox/updateShelfBox',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/inventory/shelf-boxes/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)


const shelfBoxeslice = createSlice({
    name: 'shelfBox',
    initialState,
    reducers: {},
    
    extraReducers: (builder) => {
        builder
        .addCase(fetchShelfBoxes.pending, (state) => {
            state.shelfBoxes.loading = true;
            state.shelfBoxes.error = null;
        })
        .addCase(fetchShelfBoxes.fulfilled, (state, action: PayloadAction<[]>) => {
            state.shelfBoxes.loading = false;
            state.shelfBoxes.data = action.payload;
        })
        .addCase(fetchShelfBoxes.rejected, (state, action) => {
            state.shelfBoxes.loading = false;
            state.shelfBoxes.error = action.payload || 'Unknown error';
        })
        .addCase(fetchShelfBox.pending, (state) => {
                        state.shelfBox.loading = true;
                        state.shelfBox.error = null;
                    })
        .addCase(fetchShelfBox.fulfilled, (state, action: PayloadAction<[]>) => {
            state.shelfBox.loading = false;
            state.shelfBox.data = action.payload;
        })
        .addCase(fetchShelfBox.rejected, (state, action) => {
            state.shelfBox.loading = false;
            state.shelfBox.error = action.payload || 'Unknown error';
        })
        .addCase(createShelfBox.pending, (state) => {
            state.shelfBox.loading = true;
            state.shelfBox.error = null;
        })
        .addCase(createShelfBox.fulfilled, (state, action: PayloadAction<[]>) => {
            state.shelfBox.loading = false;
            state.shelfBox.data = action.payload;
        })
        .addCase(createShelfBox.rejected, (state, action) => {
            state.shelfBox.loading = false;
            state.shelfBox.error = action.payload || 'Unknown error';
        })
        .addCase(updateShelfBox.pending, (state) => {
            state.shelfBox.loading = true;
            state.shelfBox.error = null;
        })
        .addCase(updateShelfBox.fulfilled, (state, action: PayloadAction<[]>) => {
            state.shelfBox.loading = false;
            state.shelfBox.data = action.payload;
        })
        .addCase(updateShelfBox.rejected, (state, action) => {
            state.shelfBox.loading = false;
            state.shelfBox.error = action.payload || 'Unknown error';
        })
    }
})

// export const { createShelfBox, updateShelfBox, deleteShelfBox } = shelfBoxeslice.actions;
export default shelfBoxeslice.reducer;