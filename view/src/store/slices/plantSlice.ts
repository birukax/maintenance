import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface PlantState {
    plants: DataState;
    plant: DataState;
}

const initialState: PlantState = {
    plants: {data: null, loading: false, error: null},
    plant: {data: null, loading: false, error: null},
};

export const fetchPlants = createAsyncThunk<[], void, {rejectValue: string}>(
    'plant/fetchPlants',
    async(_, {rejectWithValue }) => {
        try {
            const response = await api.get('/location/plants/');
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch plants');
        }
    }
)


export const fetchPlant = createAsyncThunk<[], number, { rejectValue: string }>(
    'plant/fetchPlant',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/location/plants/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const createPlant = createAsyncThunk<[],  formData  , { rejectValue: string }>(
    'plant/createPlant',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/location/plants/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const updatePlant = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'plant/updatePlant',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/location/plants/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
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
        .addCase(fetchPlants.fulfilled, (state, action: PayloadAction<[]>) => {
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
        .addCase(fetchPlant.fulfilled, (state, action: PayloadAction<[]>) => {
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
        .addCase(createPlant.fulfilled, (state, action: PayloadAction<[]>) => {
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
        .addCase(updatePlant.fulfilled, (state, action: PayloadAction<[]>) => {
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