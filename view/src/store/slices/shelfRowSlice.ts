import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState } from "../types";


interface ShelfRowState {
    shelfRows: DataState<Data[]>;
    shelfRow: DataState<Data | null>;
}

const initialState: ShelfRowState = {
    shelfRows: { data: [], loading: false, error: null },
    shelfRow: { data: null, loading: false, error: null },
};

export const fetchShelfRows = createAsyncThunk<Data[], FetchParams, { rejectValue: any }>(
    'shelfRow/fetchShelfRows',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/inventory/shelf-rows/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Failed to fetch shelf rows');
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const fetchShelfRow = createAsyncThunk<Data, number, { rejectValue: any }>(
    'shelfRow/fetchShelfRow',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/inventory/shelf-rows/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || "Failed to fetch shelf row.");
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const createShelfRow = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'shelfRow/createShelfRow',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/inventory/shelf-rows/', formData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || "Failed to create shelf row.");
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const updateShelfRow = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'shelfRow/updateShelfRow',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/inventory/shelf-rows/${id}/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || "Failed to update shelf row.");
            }
            return rejectWithValue('An error occured');
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
            .addCase(fetchShelfRows.fulfilled, (state, action: PayloadAction<Data[]>) => {
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
            .addCase(fetchShelfRow.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(createShelfRow.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(updateShelfRow.fulfilled, (state, action: PayloadAction<Data>) => {
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