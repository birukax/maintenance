import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const fetchItems = createAsyncThunk(
    'auth/fetchItems',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/inventory/items/');
            return response.data;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);


export const fetchContacts = createAsyncThunk(
    'auth/fetchContacts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/inventory/contacts/');
            return response.data;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        tokens: null,
        items: { data: null, loading: false, error: null },
        contacts: { data: null, loading: false, error: null },
    },
    reducers: {
        setTokens: (state, action) => {
            state.tokens = action.payload;
        },
        logout: (state) => {
            state.tokens = null;
            state.items.data = null;
            state.contacts.data = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchItems.pending, (state) => {
                state.items.loading = true;
                state.items.error = null;
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.items.loading = false;
                state.items.data = action.payload;
            })

            .addCase(fetchContacts.pending, (state) => {
                state.contacts.loading = true;
                state.contacts.error = null;
            })
            .addCase(fetchContacts.fulfilled, (state, action) => {
                state.contacts.loading = false;
                state.contacts.data = action.payload;
            });
    },
});

export const { setTokens, logout } = authSlice.actions;
export default authSlice.reducer;