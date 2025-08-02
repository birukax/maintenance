import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface ItemState {
    items: DataState;
    item: DataState;
}

const initialState: ItemState = {
    items: { data: [], loading: false, error: null },
    item: { data: [], loading: false, error: null },
};

export const fetchItems = createAsyncThunk<[], { params: null }, { rejectValue: string }>(
    'item/fetchItems',
    async (params, { rejectWithValue }) => {
        try {

            const response = await api.get('/inventory/items/', { params: params });
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const fetchItem = createAsyncThunk<[], number, { rejectValue: string }>(
    'item/fetchItem',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/inventory/items/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const createItem = createAsyncThunk<[], formData, { rejectValue: string }>(
    'item/createItem',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/inventory/items/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const updateItem = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'item/updateItem',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/inventory/items/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)


const itemSlice = createSlice({
    name: 'item',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchItems.pending, (state) => {
                state.items.loading = true;
                state.items.error = null;
            })
            .addCase(fetchItems.fulfilled, (state, action: PayloadAction<[]>) => {
                state.items.loading = false;
                state.items.data = action.payload;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.items.loading = false;
                state.items.error = action.payload || 'Unknown error';
            })
            .addCase(fetchItem.pending, (state) => {
                state.item.loading = true;
                state.item.error = null;
            })
            .addCase(fetchItem.fulfilled, (state, action: PayloadAction<[]>) => {
                state.item.loading = false;
                state.item.data = action.payload;
            })
            .addCase(fetchItem.rejected, (state, action) => {
                state.item.loading = false;
                state.item.error = action.payload || 'Unknown error';
            })
            .addCase(createItem.pending, (state) => {
                state.item.loading = true;
                state.item.error = null;
            })
            .addCase(createItem.fulfilled, (state, action: PayloadAction<[]>) => {
                state.item.loading = false;
                state.item.data = action.payload;
            })
            .addCase(createItem.rejected, (state, action) => {
                state.item.loading = false;
                state.item.error = action.payload || 'Unknown error';
            })
            .addCase(updateItem.pending, (state) => {
                state.item.loading = true;
                state.item.error = null;
            })
            .addCase(updateItem.fulfilled, (state, action: PayloadAction<[]>) => {
                state.item.loading = false;
                state.item.data = action.payload;
            })
            .addCase(updateItem.rejected, (state, action) => {
                state.item.loading = false;
                state.item.error = action.payload || 'Unknown error';
            })
    }
})

// export const { createItem, updateItem, deleteItem } = itemSlice.actions;
export default itemSlice.reducer;