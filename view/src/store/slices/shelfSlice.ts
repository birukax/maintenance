import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState } from "../types";


interface ShelveState {
    shelves: DataState<Data[]>;
    shelf: DataState<Data | null>;
}

const initialState: ShelveState = {
    shelves: { data: [], loading: false, error: null },
    shelf: { data: null, loading: false, error: null },
};

export const fetchShelves = createAsyncThunk<Data[], FetchParams, { rejectValue: any }>(
    'shelve/fetchShelves',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/inventory/shelves/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch shelves.');
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const fetchShelf = createAsyncThunk<Data, number, { rejectValue: any }>(
    'shelve/fetchShelve',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/inventory/shelves/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || "Failed to fetch shelf.");
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const createShelf = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'shelve/createShelve',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/inventory/shelves/', formData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || "Failed to create shelf.");
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const updateShelf = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'shelve/updateShelve',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/inventory/shelves/${id}/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || "Failed to update shelf.");
            }
            return rejectWithValue('An error occured');
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
            .addCase(fetchShelves.fulfilled, (state, action: PayloadAction<Data[]>) => {
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
            .addCase(fetchShelf.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(createShelf.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(updateShelf.fulfilled, (state, action: PayloadAction<Data>) => {
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