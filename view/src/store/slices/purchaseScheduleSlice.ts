import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface PurchaseScheduleState {
    purchaseSchedules: DataState;
    purchaseSchedule: DataState;
}

const initialState: PurchaseScheduleState = {
    purchaseSchedules: {data: [], loading: false, error: null},
    purchaseSchedule: {data: [], loading: false, error: null},
};


export const fetchPurchaseSchedules = createAsyncThunk<[], {params:null}, {rejectValue: string}>(
    'purchaseSchedule/fetchPurchaseSchedules',
    async(params, {rejectWithValue }) => {
        try {
                const response = await api.get('/purchase/schedules/', {params});
                return response.data;
            
            
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch Purchase Schedules');
        }
    }
)

export const fetchPurchaseSchedule = createAsyncThunk<[], number, { rejectValue: string }>(
    'purchaseSchedule/fetchPurchaseSchedule',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/purchase/schedules/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch Purchase Schedule');
        }
    }
)

export const createPurchaseSchedule = createAsyncThunk<[],  {formData,monthFormData}  , { rejectValue: string }>(
    'purchaseSchedule/createPurchaseSchedule',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/purchase/schedules/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to crete Purchase Schedule');
        }
    }
)

export const updatePurchaseSchedule = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'purchaseSchedule/updatePurchaseSchedule',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/purchase/schedules/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update Purchase Schedule');
        }
    }
)


export const createAnnualSchedule = createAsyncThunk<[], { formData: { [key: string] } }, { rejectValue: string }>(
    'purchaseSchedule/createAnnualSchedule',
    async ({  formData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/purchase/schedules/create_annual_schedule/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to create annual schedule');
        }
    }
)




const purchaseScheduleSlice = createSlice({
    name: 'purchaseSchedule',
    initialState,
    reducers: {
        clearPurchaseSchedules: (state) => {
            state.purchaseSchedules = {
                data: [],
                loading: false,
                error: null,
            };
        },
    },
    
    extraReducers: (builder) => {
        builder
        .addCase(fetchPurchaseSchedules.pending, (state) => {
            state.purchaseSchedules.loading = true;
            state.purchaseSchedules.error = null;
        })
        .addCase(fetchPurchaseSchedules.fulfilled, (state, action: PayloadAction<[]>) => {
            state.purchaseSchedules.loading = false;
            state.purchaseSchedules.data = action.payload;
        })
        .addCase(fetchPurchaseSchedules.rejected, (state, action) => {
            state.purchaseSchedules.loading = false;
            state.purchaseSchedules.error = action.payload || 'Unknown error';
        })
        .addCase(fetchPurchaseSchedule.pending, (state) => {
            state.purchaseSchedule.loading = true;
            state.purchaseSchedule.error = null;
        })
        .addCase(fetchPurchaseSchedule.fulfilled, (state, action: PayloadAction<[]>) => {
            state.purchaseSchedule.loading = false;
            state.purchaseSchedule.data = action.payload;
        })
        .addCase(fetchPurchaseSchedule.rejected, (state, action) => {
            state.purchaseSchedule.loading = false;
            state.purchaseSchedule.error = action.payload || 'Unknown error';
        })
        .addCase(createPurchaseSchedule.pending, (state) => {
            state.purchaseSchedule.loading = true;
            state.purchaseSchedule.error = null;
        })
        .addCase(createPurchaseSchedule.fulfilled, (state, action: PayloadAction<[]>) => {
            state.purchaseSchedule.loading = false;
            state.purchaseSchedule.data = action.payload;
        })
        .addCase(createPurchaseSchedule.rejected, (state, action) => {
            state.purchaseSchedule.loading = false;
            state.purchaseSchedule.error = action.payload || 'Unknown error';
        })
        .addCase(updatePurchaseSchedule.pending, (state) => {
            state.purchaseSchedule.loading = true;
            state.purchaseSchedule.error = null;
        })
        .addCase(updatePurchaseSchedule.fulfilled, (state, action: PayloadAction<[]>) => {
            state.purchaseSchedule.loading = false;
            state.purchaseSchedule.data = action.payload;
        })
        .addCase(updatePurchaseSchedule.rejected, (state, action) => {
            state.purchaseSchedule.loading = false;
            state.purchaseSchedule.error = action.payload || 'Unknown error';
        })
        .addCase(createAnnualSchedule.pending, (state) => {
            state.purchaseSchedule.loading = true;
            state.purchaseSchedule.error = null;
        })
        .addCase(createAnnualSchedule.fulfilled, (state, action: PayloadAction<[]>) => {
            state.purchaseSchedule.loading = false;
            state.purchaseSchedule.data = action.payload;
        })
        .addCase(createAnnualSchedule.rejected, (state, action) => {
            state.purchaseSchedule.loading = false;
            state.purchaseSchedule.error = action.payload || 'Unknown error';
        })
    }
})

export const clear = createAsyncThunk<void,void, {rejectValue: string}>(
    'purchaseSchedule/clear',
    async(_, {dispatch }) => {
        try {
            dispatch(clearPurchaseSchedules())  
            console.log("cleared");     
        }
        catch (err) {
            throw new Error(err.message || "Logout failed");

        }
    }
)


// export const { createPurchaseSchedule, updatePurchaseSchedule, deletePurchaseSchedule } = purchaseScheduleSlice.actions;
export const { clearPurchaseSchedules } = purchaseScheduleSlice.actions
export default purchaseScheduleSlice.reducer;