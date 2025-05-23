import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface YearState {
    years: DataState;
    year: DataState;
}

const initialState: YearState = {
    years: {data: [], loading: false, error: null},
    year: {data: [], loading: false, error: null},
};

export const fetchYears = createAsyncThunk<[], void, {rejectValue: string}>(
    'year/fetchYears',
    async(_, {rejectWithValue }) => {
        try {
            const response = await api.get('/purchase/years/');
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch years');
        }
    }
)


export const fetchYear = createAsyncThunk<[], number, { rejectValue: string }>(
    'year/fetchYear',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/purchase/years/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const createYear = createAsyncThunk<[],  formData  , { rejectValue: string }>(
    'year/createYear',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/purchase/years/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const updateYear = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'year/updateYear',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/purchase/years/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)


const yearSlice = createSlice({
    name: 'year',
    initialState,
    reducers: {},
    
    extraReducers: (builder) => {
        builder
        .addCase(fetchYears.pending, (state) => {
            state.years.loading = true;
            state.years.error = null;
        })
        .addCase(fetchYears.fulfilled, (state, action: PayloadAction<[]>) => {
            state.years.loading = false;
            state.years.data = action.payload;
        })
        .addCase(fetchYears.rejected, (state, action) => {
            state.years.loading = false;
            state.years.error = action.payload || 'Unknown error';
        })
        .addCase(fetchYear.pending, (state) => {
                        state.year.loading = true;
                        state.year.error = null;
                    })
                    .addCase(fetchYear.fulfilled, (state, action: PayloadAction<[]>) => {
                        state.year.loading = false;
                        state.year.data = action.payload;
                    })
                    .addCase(fetchYear.rejected, (state, action) => {
                        state.year.loading = false;
                        state.year.error = action.payload || 'Unknown error';
                    })
                    .addCase(createYear.pending, (state) => {
                        state.year.loading = true;
                        state.year.error = null;
                    })
                    .addCase(createYear.fulfilled, (state, action: PayloadAction<[]>) => {
                        state.year.loading = false;
                        state.year.data = action.payload;
                    })
                    .addCase(createYear.rejected, (state, action) => {
                        state.year.loading = false;
                        state.year.error = action.payload || 'Unknown error';
                    })
                    .addCase(updateYear.pending, (state) => {
                        state.year.loading = true;
                        state.year.error = null;
                    })
                    .addCase(updateYear.fulfilled, (state, action: PayloadAction<[]>) => {
                        state.year.loading = false;
                        state.year.data = action.payload;
                    })
                    .addCase(updateYear.rejected, (state, action) => {
                        state.year.loading = false;
                        state.year.error = action.payload || 'Unknown error';
                    })
    }
})

// export const { createYear, updateYear, deleteYear } = yearSlice.actions;
export default yearSlice.reducer;