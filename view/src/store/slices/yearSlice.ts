import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState } from "../types";


interface YearState {
    years: DataState<Data[]>;
    year: DataState<Data | null>;
}

const initialState: YearState = {
    years: { data: [], loading: false, error: null },
    year: { data: null, loading: false, error: null },
};

export const fetchYears = createAsyncThunk<Data[], FetchParams, { rejectValue: any }>(
    'year/fetchYears',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/purchase/years/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch years');
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const fetchYear = createAsyncThunk<Data, number | string, { rejectValue: any }>(
    'year/fetchYear',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/purchase/years/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch year');

            }
            return rejectWithValue('An error occured');
        }
    }
)

export const createYear = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'year/createYear',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/purchase/years/', formData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to create year');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const updateYear = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'year/updateYear',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/purchase/years/${id}/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to update year');
            }
            return rejectWithValue('An error occured');
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
            .addCase(fetchYears.fulfilled, (state, action: PayloadAction<Data[]>) => {
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
            .addCase(fetchYear.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(createYear.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(updateYear.fulfilled, (state, action: PayloadAction<Data>) => {
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