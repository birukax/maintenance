import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState } from "../types";

interface LocationState {
    locations: DataState<Data[]>;
    location: DataState<Data | null>;
}

const initialState: LocationState = {
    locations: { data: [], loading: false, error: null },
    location: { data: null, loading: false, error: null },
};

export const fetchLocations = createAsyncThunk<Data[], FetchParams, { rejectValue: any }>(
    'location/fetchLocations',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/inventory/locations/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch locations');
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const fetchLocation = createAsyncThunk<Data, number | string, { rejectValue: any }>(
    'location/fetchLocation',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/inventory/locations/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || "Failed to fetch location.");
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const createLocation = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'location/createLocation',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/inventory/locations/', formData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || "Failed to create location.");
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const updateLocation = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'location/updateLocation',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/inventory/locations/${id}/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || "Failed to update location.");
            }
            return rejectWithValue('An error occured');
        }
    }
)


const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchLocations.pending, (state) => {
                state.locations.loading = true;
                state.locations.error = null;
            })
            .addCase(fetchLocations.fulfilled, (state, action: PayloadAction<Data[]>) => {
                state.locations.loading = false;
                state.locations.data = action.payload;
            })
            .addCase(fetchLocations.rejected, (state, action) => {
                state.locations.loading = false;
                state.locations.error = action.payload || 'Unknown error';
            })
            .addCase(fetchLocation.pending, (state) => {
                state.location.loading = true;
                state.location.error = null;
            })
            .addCase(fetchLocation.fulfilled, (state, action: PayloadAction<Data>) => {
                state.location.loading = false;
                state.location.data = action.payload;
            })
            .addCase(fetchLocation.rejected, (state, action) => {
                state.location.loading = false;
                state.location.error = action.payload || 'Unknown error';
            })
            .addCase(createLocation.pending, (state) => {
                state.location.loading = true;
                state.location.error = null;
            })
            .addCase(createLocation.fulfilled, (state, action: PayloadAction<Data>) => {
                state.location.loading = false;
                state.location.data = action.payload;
            })
            .addCase(createLocation.rejected, (state, action) => {
                state.location.loading = false;
                state.location.error = action.payload || 'Unknown error';
            })
            .addCase(updateLocation.pending, (state) => {
                state.location.loading = true;
                state.location.error = null;
            })
            .addCase(updateLocation.fulfilled, (state, action: PayloadAction<Data>) => {
                state.location.loading = false;
                state.location.data = action.payload;
            })
            .addCase(updateLocation.rejected, (state, action) => {
                state.location.loading = false;
                state.location.error = action.payload || 'Unknown error';
            })
    }
})

// export const { createLocation, updateLocation, deleteLocation } = locationSlice.actions;
export default locationSlice.reducer;