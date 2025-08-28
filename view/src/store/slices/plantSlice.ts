import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState, PaginatedData } from "../types";

interface PlantState {
    plants: DataState<PaginatedData<Data[]> | Data[] | []>;
    plant: DataState<Data | null>;
}

const initialState: PlantState = {
    plants: { data: [], loading: false, error: null },
    plant: { data: null, loading: false, error: null },
};

export const fetchPlants = createAsyncThunk<PaginatedData<Data[]>, FetchParams, { rejectValue: any }>(
    'plant/fetchPlants',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/asset/plants/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch plants');
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const fetchPlant = createAsyncThunk<Data, number | string, { rejectValue: any }>(
    'plant/fetchPlant',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/asset/plants/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || "Failed to fetch plant.");
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const createPlant = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'plant/createPlant',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/asset/plants/', formData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || "Failed to create plant.");
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const updatePlant = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'plant/updatePlant',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/asset/plants/${id}/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || "Failed to update plant.");
            }
            return rejectWithValue('An error occured');
        }
    }
)


const plantSlice = createSlice({
    name: 'plant',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchPlants.pending, (state) => {
                state.plants.loading = true;
                state.plants.error = null;
            })
            .addCase(fetchPlants.fulfilled, (state, action: PayloadAction<PaginatedData<Data[]>>) => {
                state.plants.loading = false;
                state.plants.data = action.payload;
            })
            .addCase(fetchPlants.rejected, (state, action) => {
                state.plants.loading = false;
                state.plants.error = action.payload || 'Unknown error';
            })
            .addCase(fetchPlant.pending, (state) => {
                state.plant.loading = true;
                state.plant.error = null;
            })
            .addCase(fetchPlant.fulfilled, (state, action: PayloadAction<Data>) => {
                state.plant.loading = false;
                state.plant.data = action.payload;
            })
            .addCase(fetchPlant.rejected, (state, action) => {
                state.plant.loading = false;
                state.plant.error = action.payload || 'Unknown error';
            })
            .addCase(createPlant.pending, (state) => {
                state.plant.loading = true;
                state.plant.error = null;
            })
            .addCase(createPlant.fulfilled, (state, action: PayloadAction<Data>) => {
                state.plant.loading = false;
                state.plant.data = action.payload;
            })
            .addCase(createPlant.rejected, (state, action) => {
                state.plant.loading = false;
                state.plant.error = action.payload || 'Unknown error';
            })
            .addCase(updatePlant.pending, (state) => {
                state.plant.loading = true;
                state.plant.error = null;
            })
            .addCase(updatePlant.fulfilled, (state, action: PayloadAction<Data>) => {
                state.plant.loading = false;
                state.plant.data = action.payload;
            })
            .addCase(updatePlant.rejected, (state, action) => {
                state.plant.loading = false;
                state.plant.error = action.payload || 'Unknown error';
            })
    }
})

// export const { createPlant, updatePlant, deletePlant } = plantSlice.actions;
export default plantSlice.reducer;