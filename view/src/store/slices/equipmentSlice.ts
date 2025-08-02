import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface EquipmentState {
    equipments: DataState;
    equipment: DataState;
}

const initialState: EquipmentState = {
    equipments: { data: [], loading: false, error: null },
    equipment: { data: [], loading: false, error: null },
};

export const fetchEquipments = createAsyncThunk<[], { params: null }, { rejectValue: string }>(
    'equipment/fetchEquipments',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/asset/equipments/', { params });
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch equipments');
        }
    }
)


export const fetchEquipment = createAsyncThunk<[], number, { rejectValue: string }>(
    'equipment/fetchEquipment',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/asset/equipments/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const createEquipment = createAsyncThunk<[], formData, { rejectValue: string }>(
    'equipment/createEquipment',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/asset/equipments/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const updateEquipment = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'equipment/updateEquipment',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/asset/equipments/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)


const equipmentSlice = createSlice({
    name: 'equipment',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchEquipments.pending, (state) => {
                state.equipments.loading = true;
                state.equipments.error = null;
            })
            .addCase(fetchEquipments.fulfilled, (state, action: PayloadAction<[]>) => {
                state.equipments.loading = false;
                state.equipments.data = action.payload;
            })
            .addCase(fetchEquipments.rejected, (state, action) => {
                state.equipments.loading = false;
                state.equipments.error = action.payload || 'Unknown error';
            })
            .addCase(fetchEquipment.pending, (state) => {
                state.equipment.loading = true;
                state.equipment.error = null;
            })
            .addCase(fetchEquipment.fulfilled, (state, action: PayloadAction<[]>) => {
                state.equipment.loading = false;
                state.equipment.data = action.payload;
            })
            .addCase(fetchEquipment.rejected, (state, action) => {
                state.equipment.loading = false;
                state.equipment.error = action.payload || 'Unknown error';
            })
            .addCase(createEquipment.pending, (state) => {
                state.equipment.loading = true;
                state.equipment.error = null;
            })
            .addCase(createEquipment.fulfilled, (state, action: PayloadAction<[]>) => {
                state.equipment.loading = false;
                state.equipment.data = action.payload;
            })
            .addCase(createEquipment.rejected, (state, action) => {
                state.equipment.loading = false;
                state.equipment.error = action.payload || 'Unknown error';
            })
            .addCase(updateEquipment.pending, (state) => {
                state.equipment.loading = true;
                state.equipment.error = null;
            })
            .addCase(updateEquipment.fulfilled, (state, action: PayloadAction<[]>) => {
                state.equipment.loading = false;
                state.equipment.data = action.payload;
            })
            .addCase(updateEquipment.rejected, (state, action) => {
                state.equipment.loading = false;
                state.equipment.error = action.payload || 'Unknown error';
            })
    }
})

// export const { createEquipment, updateEquipment, deleteEquipment } = equipmentSlice.actions;
export default equipmentSlice.reducer;