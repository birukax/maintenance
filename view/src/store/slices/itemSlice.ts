import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState } from "../types";

interface ItemState {
    items: DataState<Data[]>;
    item: DataState<Data | null>;
}

const initialState: ItemState = {
    items: { data: [], loading: false, error: null },
    item: { data: null, loading: false, error: null },
};

export const fetchItems = createAsyncThunk<Data[], FetchParams, { rejectValue: any }>(
    'item/fetchItems',
    async (params, { rejectWithValue }) => {
        try {

            const response = await api.get('/inventory/items/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch items.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const fetchItem = createAsyncThunk<Data, number | string, { rejectValue: any }>(
    'item/fetchItem',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/inventory/items/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch item.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const createItem = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'item/createItem',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/inventory/items/', formData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to create item.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const updateItem = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'item/updateItem',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/inventory/items/${id}/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to update item.');
            }
            return rejectWithValue('An error occured');
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
            .addCase(fetchItems.fulfilled, (state, action: PayloadAction<Data[]>) => {
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
            .addCase(fetchItem.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(createItem.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(updateItem.fulfilled, (state, action: PayloadAction<Data>) => {
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