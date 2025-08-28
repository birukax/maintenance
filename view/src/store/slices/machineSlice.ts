import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState, PaginatedData } from "../types";


interface MachineState {
    machines: DataState<PaginatedData<Data[]> | Data[] | []>;
    machine: DataState<Data | null>;
}

const initialState: MachineState = {
    machines: { data: [], loading: false, error: null },
    machine: { data: null, loading: false, error: null },
};

export const fetchMachines = createAsyncThunk<PaginatedData<Data[]>, FetchParams, { rejectValue: any }>(
    'machine/fetchMachines',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/asset/machines/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch machines');
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const fetchMachine = createAsyncThunk<Data, number | string, { rejectValue: any }>(
    'machine/fetchMachine',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/asset/machines/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch machine.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const createMachine = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'machine/createMachine',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/asset/machines/', formData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to create machine.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const updateMachine = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'machine/updateMachine',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/asset/machines/${id}/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to update machine.');
            }
            return rejectWithValue('An error occured');
        }
    }
)


const machineSlice = createSlice({
    name: 'machine',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchMachines.pending, (state) => {
                state.machines.loading = true;
                state.machines.error = null;
            })
            .addCase(fetchMachines.fulfilled, (state, action: PayloadAction<PaginatedData<Data[]>>) => {
                state.machines.loading = false;
                state.machines.data = action.payload;
            })
            .addCase(fetchMachines.rejected, (state, action) => {
                state.machines.loading = false;
                state.machines.error = action.payload || 'Unknown error';
            })
            .addCase(fetchMachine.pending, (state) => {
                state.machine.loading = true;
                state.machine.error = null;
            })
            .addCase(fetchMachine.fulfilled, (state, action: PayloadAction<Data>) => {
                state.machine.loading = false;
                state.machine.data = action.payload;
            })
            .addCase(fetchMachine.rejected, (state, action) => {
                state.machine.loading = false;
                state.machine.error = action.payload || 'Unknown error';
            })
            .addCase(createMachine.pending, (state) => {
                state.machine.loading = true;
                state.machine.error = null;
            })
            .addCase(createMachine.fulfilled, (state, action: PayloadAction<Data>) => {
                state.machine.loading = false;
                state.machine.data = action.payload;
            })
            .addCase(createMachine.rejected, (state, action) => {
                state.machine.loading = false;
                state.machine.error = action.payload || 'Unknown error';
            })
            .addCase(updateMachine.pending, (state) => {
                state.machine.loading = true;
                state.machine.error = null;
            })
            .addCase(updateMachine.fulfilled, (state, action: PayloadAction<Data>) => {
                state.machine.loading = false;
                state.machine.data = action.payload;
            })
            .addCase(updateMachine.rejected, (state, action) => {
                state.machine.loading = false;
                state.machine.error = action.payload || 'Unknown error';
            })
    }
})

// export const { createMachine, updateMachine, deleteMachine } = machineSlice.actions;
export default machineSlice.reducer;