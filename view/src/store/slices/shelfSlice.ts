import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface ShelveState {
    shelves: DataState;
    shelf: DataState;
}

const initialState: ShelveState = {
    shelves: { data: [], loading: false, error: null },
    shelf: { data: [], loading: false, error: null },
};

export const fetchShelves = createAsyncThunk<[], { params: null }, { rejectValue: string }>(
    'shelve/fetchShelves',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/inventory/shelves/', { params });
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch shelves');
        }
    }
)


export const fetchShelf = createAsyncThunk<[], number, { rejectValue: string }>(
    'shelve/fetchShelve',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/inventory/shelves/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const createShelf = createAsyncThunk<[], formData, { rejectValue: string }>(
    'shelve/createShelve',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/inventory/shelves/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const updateShelf = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'shelve/updateShelve',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/inventory/shelves/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)


const shelveSlice = createSlice({
    name: 'shelf',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchShelves.pending, (state) => {
                state.shelves.loading = true;
                state.shelves.error = null;
            })
            .addCase(fetchShelves.fulfilled, (state, action: PayloadAction<[]>) => {
                state.shelves.loading = false;
                state.shelves.data = action.payload;
            })
            .addCase(fetchShelves.rejected, (state, action) => {
                state.shelves.loading = false;
                state.shelves.error = action.payload || 'Unknown error';
            })
            .addCase(fetchShelf.pending, (state) => {
                state.shelf.loading = true;
                state.shelf.error = null;
            })
            .addCase(fetchShelf.fulfilled, (state, action: PayloadAction<[]>) => {
                state.shelf.loading = false;
                state.shelf.data = action.payload;
            })
            .addCase(fetchShelf.rejected, (state, action) => {
                state.shelf.loading = false;
                state.shelf.error = action.payload || 'Unknown error';
            })
            .addCase(createShelf.pending, (state) => {
                state.shelf.loading = true;
                state.shelf.error = null;
            })
            .addCase(createShelf.fulfilled, (state, action: PayloadAction<[]>) => {
                state.shelf.loading = false;
                state.shelf.data = action.payload;
            })
            .addCase(createShelf.rejected, (state, action) => {
                state.shelf.loading = false;
                state.shelf.error = action.payload || 'Unknown error';
            })
            .addCase(updateShelf.pending, (state) => {
                state.shelf.loading = true;
                state.shelf.error = null;
            })
            .addCase(updateShelf.fulfilled, (state, action: PayloadAction<[]>) => {
                state.shelf.loading = false;
                state.shelf.data = action.payload;
            })
            .addCase(updateShelf.rejected, (state, action) => {
                state.shelf.loading = false;
                state.shelf.error = action.payload || 'Unknown error';
            })
    }
})

// export const { createShelve, updateShelve, deleteShelve } = shelveSlice.actions;
export default shelveSlice.reducer;