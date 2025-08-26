import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState } from "../types";

interface AreaState {
    areas: DataState<Data[]>;
    area: DataState<Data | null>;
}

const initialState: AreaState = {
    areas: { data: [], loading: false, error: null },
    area: { data: null, loading: false, error: null },
};

export const fetchAreas = createAsyncThunk<Data[], FetchParams, { rejectValue: any }>(
    'area/fetchAreas',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/asset/areas/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch areas');
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const fetchArea = createAsyncThunk<Data, number | string, { rejectValue: any }>(
    'area/fetchArea',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/asset/areas/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch area.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const createArea = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'area/createArea',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/asset/areas/', formData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to create area.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const updateArea = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'area/updateArea',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/asset/areas/${id}/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to update area.');
            }
            return rejectWithValue('An error occured');
        }
    }
)


const areaSlice = createSlice({
    name: 'area',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchAreas.pending, (state) => {
                state.areas.loading = true;
                state.areas.error = null;
            })
            .addCase(fetchAreas.fulfilled, (state, action: PayloadAction<Data[]>) => {
                state.areas.loading = false;
                state.areas.data = action.payload;
            })
            .addCase(fetchAreas.rejected, (state, action) => {
                state.areas.loading = false;
                state.areas.error = action.payload || 'Unknown error';
            })
            .addCase(fetchArea.pending, (state) => {
                state.area.loading = true;
                state.area.error = null;
            })
            .addCase(fetchArea.fulfilled, (state, action: PayloadAction<Data>) => {
                state.area.loading = false;
                state.area.data = action.payload;
            })
            .addCase(fetchArea.rejected, (state, action) => {
                state.area.loading = false;
                state.area.error = action.payload || 'Unknown error';
            })
            .addCase(createArea.pending, (state) => {
                state.area.loading = true;
                state.area.error = null;
            })
            .addCase(createArea.fulfilled, (state, action: PayloadAction<Data>) => {
                state.area.loading = false;
                state.area.data = action.payload;
            })
            .addCase(createArea.rejected, (state, action) => {
                state.area.loading = false;
                state.area.error = action.payload || 'Unknown error';
            })
            .addCase(updateArea.pending, (state) => {
                state.area.loading = true;
                state.area.error = null;
            })
            .addCase(updateArea.fulfilled, (state, action: PayloadAction<Data>) => {
                state.area.loading = false;
                state.area.data = action.payload;
            })
            .addCase(updateArea.rejected, (state, action) => {
                state.area.loading = false;
                state.area.error = action.payload || 'Unknown error';
            })
    }
})

// export const { createArea, updateArea, deleteArea } = areaSlice.actions;
export default areaSlice.reducer;