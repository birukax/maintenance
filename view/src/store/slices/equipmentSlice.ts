import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState, PaginatedData } from "../types";

interface EquipmentState {
    equipments: DataState<PaginatedData<Data[]> | Data[] | []>;
    equipment: DataState<Data | null>;
}

const initialState: EquipmentState = {
    equipments: { data: [], loading: false, error: null },
    equipment: { data: null, loading: false, error: null },
};

export const fetchEquipments = createAsyncThunk<PaginatedData<Data[]>, FetchParams, { rejectValue: any }>(
    'equipment/fetchEquipments',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/asset/equipments/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch equipments');
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const fetchEquipment = createAsyncThunk<Data, number | string, { rejectValue: any }>(
    'equipment/fetchEquipment',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/asset/equipments/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch equipment.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const createEquipment = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'equipment/createEquipment',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/asset/equipments/', formData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to create equipment.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const updateEquipment = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'equipment/updateEquipment',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/asset/equipments/${id}/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to update equipment.');
            }
            return rejectWithValue('An error occured');
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
            .addCase(fetchEquipments.fulfilled, (state, action: PayloadAction<PaginatedData<Data[]>>) => {
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
            .addCase(fetchEquipment.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(createEquipment.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(updateEquipment.fulfilled, (state, action: PayloadAction<Data>) => {
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