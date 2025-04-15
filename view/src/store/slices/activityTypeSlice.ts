import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface ActivityTypeState {
    activityTypes: DataState;
    activityType: DataState;
}

const initialState: ActivityTypeState = {
    activityTypes: {data: null, loading: false, error: null},
    activityType: {data: null, loading: false, error: null},
};

export const fetchActivityTypes = createAsyncThunk<[], void, {rejectValue: string}>(
    'activityType/fetchActivityTypes',
    async(_, {rejectWithValue }) => {
        try {
            const response = await api.get('/work-order/activity-types/');
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch activity types');
        }
    }
)


export const fetchActivityType = createAsyncThunk<[], number, { rejectValue: string }>(
    'activityType/fetchActivityType',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/work-order/activity-types/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const createActivityType = createAsyncThunk<[],  formData  , { rejectValue: string }>(
    'activityType/createActivityType',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/work-order/activity-types/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const updateActivityType = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'activityType/updateActivityType',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/work-order/activity-types/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)


const activityTypeSlice = createSlice({
    name: 'activityType',
    initialState,
    reducers: {},
    
    extraReducers: (builder) => {
        builder
        .addCase(fetchActivityTypes.pending, (state) => {
            state.activityTypes.loading = true;
            state.activityTypes.error = null;
        })
        .addCase(fetchActivityTypes.fulfilled, (state, action: PayloadAction<[]>) => {
            state.activityTypes.loading = false;
            state.activityTypes.data = action.payload;
        })
        .addCase(fetchActivityTypes.rejected, (state, action) => {
            state.activityTypes.loading = false;
            state.activityTypes.error = action.payload || 'Unknown error';
        })
        .addCase(fetchActivityType.pending, (state) => {
                        state.activityType.loading = true;
                        state.activityType.error = null;
                    })
                    .addCase(fetchActivityType.fulfilled, (state, action: PayloadAction<[]>) => {
                        state.activityType.loading = false;
                        state.activityType.data = action.payload;
                    })
                    .addCase(fetchActivityType.rejected, (state, action) => {
                        state.activityType.loading = false;
                        state.activityType.error = action.payload || 'Unknown error';
                    })
                    .addCase(createActivityType.pending, (state) => {
                        state.activityType.loading = true;
                        state.activityType.error = null;
                    })
                    .addCase(createActivityType.fulfilled, (state, action: PayloadAction<[]>) => {
                        state.activityType.loading = false;
                        state.activityType.data = action.payload;
                    })
                    .addCase(createActivityType.rejected, (state, action) => {
                        state.activityType.loading = false;
                        state.activityType.error = action.payload || 'Unknown error';
                    })
                    .addCase(updateActivityType.pending, (state) => {
                        state.activityType.loading = true;
                        state.activityType.error = null;
                    })
                    .addCase(updateActivityType.fulfilled, (state, action: PayloadAction<[]>) => {
                        state.activityType.loading = false;
                        state.activityType.data = action.payload;
                    })
                    .addCase(updateActivityType.rejected, (state, action) => {
                        state.activityType.loading = false;
                        state.activityType.error = action.payload || 'Unknown error';
                    })
    }
})

// export const { createActivityType, updateActivityType, deleteActivityType } = activityTypeSlice.actions;
export default activityTypeSlice.reducer;