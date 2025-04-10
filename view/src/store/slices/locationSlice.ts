import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface LocationState {
    locations: DataState;
    location: DataState;
}

const initialState: LocationState = {
    locations: {data: null, loading: false, error: null},
    location: {data: null, loading: false, error: null},
};

export const fetchLocations = createAsyncThunk<[], void, {rejectValue: string}>(
    'location/fetchLocations',
    async(_, {rejectWithValue }) => {
        try {
            const response = await api.get('/inventory/locations/');
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch locations');
        }
    }
)


export const fetchLocation = createAsyncThunk<[], number, { rejectValue: string }>(
    'location/fetchLocation',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/inventory/locations/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const createLocation = createAsyncThunk<[],  formData  , { rejectValue: string }>(
    'location/createLocation',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/inventory/locations/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const updateLocation = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'location/updateLocation',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/inventory/locations/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
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
        .addCase(fetchLocations.fulfilled, (state, action: PayloadAction<[]>) => {
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
                    .addCase(fetchLocation.fulfilled, (state, action: PayloadAction<[]>) => {
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
                    .addCase(createLocation.fulfilled, (state, action: PayloadAction<[]>) => {
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
                    .addCase(updateLocation.fulfilled, (state, action: PayloadAction<[]>) => {
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