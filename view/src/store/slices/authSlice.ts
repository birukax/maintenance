import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface Tokens {
    access: string;
    refresh: string;
}

// interface Item {
//     no: string;
//     name: string;
//     uom: string;
//     type: string;
//     category: string;
//     suppliers?: string[];
// }

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface AuthState {
    tokens: Tokens | null;
    items: DataState;
}

const initialState: AuthState = {
    tokens: null,
    items: {data: null, loading: false, error: null},
};

export const fetchItems = createAsyncThunk<[], void, {rejectValue: string}>(
    'auth/fetchItems',
    async(_, {rejectWithValue }) => {
        try {
            const response = await api.get('/inventory/items/');
            return response.data;
        }
        catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to fetch items');
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setTokens: (state, action: PayloadAction<Tokens>) => {
            state.tokens = action.payload;
        },
        logout: (state) => {
            state.tokens = null;
            state.items.data = null;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchItems.pending, (state) => {
            state.items.loading = true;
            state.items.error = null;
        })
        .addCase(fetchItems.fulfilled, (state, action: PayloadAction<[]>) => {
            state.items.loading = false;
            state.items.data = action.payload;
        })
        .addCase(fetchItems.rejected, (state, action) => {
            state.items.loading = false;
            state.items.error = action.payload || 'Unknown error';
        })
    }
})

export const { setTokens, logout } = authSlice.actions;
export default authSlice.reducer;