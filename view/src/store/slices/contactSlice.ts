import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface ContactState {
    contacts: DataState;
    contact: DataState;
}

const initialState: ContactState = {
    contacts: { data: [], loading: false, error: null },
    contact: { data: [], loading: false, error: null },
};

export const fetchContacts = createAsyncThunk<[], { params: null }, { rejectValue: any }>(
    'contact/fetchContacts',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/inventory/contacts/', { params });
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch contacts');
        }
    }
)


export const fetchContact = createAsyncThunk<[], number, { rejectValue: any }>(
    'contact/fetchContact',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/inventory/contacts/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const createContact = createAsyncThunk<[], formData, { rejectValue: any }>(
    'contact/createContact',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/inventory/contacts/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const updateContact = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: any }>(
    'contact/updateContact',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/inventory/contacts/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)


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
            .addCase(fetchContact.pending, (state) => {
                state.contact.loading = true;
                state.contact.error = null;
            })
            .addCase(fetchContact.fulfilled, (state, action: PayloadAction<[]>) => {
                state.contact.loading = false;
                state.contact.data = action.payload;
            })
            .addCase(fetchContact.rejected, (state, action) => {
                state.contact.loading = false;
                state.contact.error = action.payload || 'Unknown error';
            })
            .addCase(createContact.pending, (state) => {
                state.contact.loading = true;
                state.contact.error = null;
            })
            .addCase(createContact.fulfilled, (state, action: PayloadAction<[]>) => {
                state.contact.loading = false;
                state.contact.data = action.payload;
            })
            .addCase(createContact.rejected, (state, action) => {
                state.contact.loading = false;
                state.contact.error = action.payload || 'Unknown error';
            })
            .addCase(updateContact.pending, (state) => {
                state.contact.loading = true;
                state.contact.error = null;
            })
            .addCase(updateContact.fulfilled, (state, action: PayloadAction<[]>) => {
                state.contact.loading = false;
                state.contact.data = action.payload;
            })
            .addCase(updateContact.rejected, (state, action) => {
                state.contact.loading = false;
                state.contact.error = action.payload || 'Unknown error';
            })
    }
})

// export const { createContact, updateContact, deleteContact } = contactSlice.actions;
export default contactSlice.reducer;