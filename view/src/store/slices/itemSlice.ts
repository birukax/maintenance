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
    items: {data: null, loading: false, error: null},
    item: {data: null, loading: false, error: null},
};

export const fetchItems = createAsyncThunk<[], void, {rejectValue: string}>(
    'item/fetchItems',
    async(_, {rejectWithValue }) => {
        try {
            const response = await api.get('/inventory/items/');
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data.detail || error.message);
        }
    }
)

export const fetchItem = createAsyncThunk<[], number, {rejectValue: string}>(
    'item/fetchItem',
    async(id, {rejectWithValue }) => {
        try {
            const response = await api.get(`/inventory/items/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data.detail || error.message);
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
    }
})

// export const { createItem, updateItem, deleteItem } = itemSlice.actions;
export default itemSlice.reducer;