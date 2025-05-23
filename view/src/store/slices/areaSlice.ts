import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface AreaState {
    areas: DataState;
    area: DataState;
}

const initialState: AreaState = {
    areas: {data: [], loading: false, error: null},
    area: {data: [], loading: false, error: null},
};

export const fetchAreas = createAsyncThunk<[], {params:null}, {rejectValue: string}>(
    'area/fetchAreas',
    async(params, {rejectWithValue }) => {
        try {
            const response = await api.get('/location/areas/',{params});
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch areas');
        }
    }
)


export const fetchArea = createAsyncThunk<[], number, { rejectValue: string }>(
    'area/fetchArea',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/location/areas/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const createArea = createAsyncThunk<[],  formData  , { rejectValue: string }>(
    'area/createArea',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/location/areas/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const updateArea = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'area/updateArea',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/location/areas/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
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
        .addCase(fetchAreas.fulfilled, (state, action: PayloadAction<[]>) => {
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
        .addCase(fetchArea.fulfilled, (state, action: PayloadAction<[]>) => {
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
        .addCase(createArea.fulfilled, (state, action: PayloadAction<[]>) => {
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
        .addCase(updateArea.fulfilled, (state, action: PayloadAction<[]>) => {
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