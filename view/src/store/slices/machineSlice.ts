import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface MachineState {
    machines: DataState;
    machine: DataState;
}

const initialState: MachineState = {
    machines: {data: null, loading: false, error: null},
    machine: {data: null, loading: false, error: null},
};

export const fetchMachines = createAsyncThunk<[], void, {rejectValue: string}>(
    'machine/fetchMachines',
    async(_, {rejectWithValue }) => {
        try {
            const response = await api.get('/asset/machines/');
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch machines');
        }
    }
)


export const fetchMachine = createAsyncThunk<[], number, { rejectValue: string }>(
    'machine/fetchMachine',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/asset/machines/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const createMachine = createAsyncThunk<[],  formData  , { rejectValue: string }>(
    'machine/createMachine',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/asset/machines/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const updateMachine = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'machine/updateMachine',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/asset/machines/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
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
        .addCase(fetchMachines.fulfilled, (state, action: PayloadAction<[]>) => {
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
        .addCase(fetchMachine.fulfilled, (state, action: PayloadAction<[]>) => {
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
        .addCase(createMachine.fulfilled, (state, action: PayloadAction<[]>) => {
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
        .addCase(updateMachine.fulfilled, (state, action: PayloadAction<[]>) => {
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