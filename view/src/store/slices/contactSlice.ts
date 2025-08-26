import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState } from "../types";


interface ContactState {
    contacts: DataState<Data[]>;
    contact: DataState<Data | null>;
}

const initialState: ContactState = {
    contacts: { data: [], loading: false, error: null },
    contact: { data: null, loading: false, error: null },
};

export const fetchContacts = createAsyncThunk<Data[], FetchParams, { rejectValue: any }>(

    'contact/fetchContacts',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/inventory/contacts/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch contacts');
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const fetchContact = createAsyncThunk<Data, number | string, { rejectValue: any }>(
    'contact/fetchContact',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/inventory/contacts/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch contact.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const createContact = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'contact/createContact',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/inventory/contacts/', formData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to create contact.');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const updateContact = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'contact/updateContact',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/inventory/contacts/${id}/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to update contact.');
            }
            return rejectWithValue('An error occured');
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
            .addCase(fetchContacts.fulfilled, (state, action: PayloadAction<Data[]>) => {
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
            .addCase(fetchContact.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(createContact.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(updateContact.fulfilled, (state, action: PayloadAction<Data>) => {
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