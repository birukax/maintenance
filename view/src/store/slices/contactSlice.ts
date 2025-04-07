import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface ContactState {
    contacts: DataState;
}

const initialState: ContactState = {
    contacts: {data: null, loading: false, error: null},
};

export const fetchContacts = createAsyncThunk<[], void, {rejectValue: string}>(
    'contact/fetchContacts',
    async(_, {rejectWithValue }) => {
        try {
            const response = await api.get('/inventory/contacts/');
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to fetch contacts');
        }
    }
)

// export 

const contactSlice = createSlice({
    name: 'contact',
    initialState,
    reducers: {},
    
    extraReducers: (builder) => {
        builder
        .addCase(fetchContacts.pending, (state) => {
            state.contacts.loading = true;
            state.contacts.error = null;
        })
        .addCase(fetchContacts.fulfilled, (state, action: PayloadAction<[]>) => {
            state.contacts.loading = false;
            state.contacts.data = action.payload;
        })
        .addCase(fetchContacts.rejected, (state, action) => {
            state.contacts.loading = false;
            state.contacts.error = action.payload || 'Unknown error';
        })
    }
})

// export const { createContact, updateContact, deleteContact } = contactSlice.actions;
export default contactSlice.reducer;