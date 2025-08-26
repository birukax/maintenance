import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState } from "../types";


interface ShelfBoxeState {
    shelfBoxes: DataState<Data[]>;
    shelfBox: DataState<Data | null>;
}

const initialState: ShelfBoxeState = {
    shelfBoxes: { data: [], loading: false, error: null },
    shelfBox: { data: null, loading: false, error: null },
};

export const fetchShelfBoxes = createAsyncThunk<Data[], FetchParams, { rejectValue: any }>(
    'shelfBox/fetchShelfBoxes',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/inventory/shelf-boxes/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch shelf boxes.');
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const fetchShelfBox = createAsyncThunk<Data, number | string, { rejectValue: any }>(
    'shelfBox/fetchShelfBox',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/inventory/shelf-boxes/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch shelf box.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const createShelfBox = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'shelfBox/createShelfBox',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/inventory/shelf-boxes/', formData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to create shelf box.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const updateShelfBox = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'shelfBox/updateShelfBox',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/inventory/shelf-boxes/${id}/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to update shelf box.');
            }
            return rejectWithValue('An error occured');
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
            .addCase(fetchShelfBoxes.fulfilled, (state, action: PayloadAction<Data[]>) => {
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
            .addCase(fetchShelfBox.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(createShelfBox.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(updateShelfBox.fulfilled, (state, action: PayloadAction<Data>) => {
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