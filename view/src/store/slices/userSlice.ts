import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState } from "../types";


interface UserState {
    users: DataState<Data[]>;
    user: DataState<Data | null>;
}

const initialState: UserState = {
    users: { data: [], loading: false, error: null },
    user: { data: null, loading: false, error: null },
};

export const fetchUsers = createAsyncThunk<Data[], FetchParams, { rejectValue: any }>(
    'user/fetchUsers',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/inventory/users/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || 'Failed to fetch users');
            }
            return rejectWithValue('An error occured')
        }
    }
)


export const fetchUser = createAsyncThunk<Data, number, { rejectValue: any }>(
    'user/fetchUser',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/inventory/users/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || "Failed to fetch user.");
            }
            return rejectWithValue('An error occured')
        }
    }
)

export const createUser = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'user/createUser',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/inventory/users/', formData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || "Failed to create user.");
            }
            return rejectWithValue('An error occured')
        }
    }
)

export const updateUser = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'user/updateUser',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/inventory/users/${id}/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data || "Failed to update user.");
            }
            return rejectWithValue('An error occured')
        }
    }
)


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.users.loading = true;
                state.users.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<Data[]>) => {
                state.users.loading = false;
                state.users.data = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.users.loading = false;
                state.users.error = action.payload || 'Unknown error';
            })
            .addCase(fetchUser.pending, (state) => {
                state.user.loading = true;
                state.user.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action: PayloadAction<Data>) => {
                state.user.loading = false;
                state.user.data = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.user.loading = false;
                state.user.error = action.payload || 'Unknown error';
            })
            .addCase(createUser.pending, (state) => {
                state.user.loading = true;
                state.user.error = null;
            })
            .addCase(createUser.fulfilled, (state, action: PayloadAction<Data>) => {
                state.user.loading = false;
                state.user.data = action.payload;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.user.loading = false;
                state.user.error = action.payload || 'Unknown error';
            })
            .addCase(updateUser.pending, (state) => {
                state.user.loading = true;
                state.user.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action: PayloadAction<Data>) => {
                state.user.loading = false;
                state.user.data = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.user.loading = false;
                state.user.error = action.payload || 'Unknown error';
            })
    }
})

// export const { createUser, updateUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;