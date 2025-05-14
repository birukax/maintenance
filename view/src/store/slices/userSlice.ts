import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface UserState {
    users: DataState;
    user: DataState;
}

const initialState: UserState = {
    users: {data: null, loading: false, error: null},
    user: {data: null, loading: false, error: null},
};

export const fetchUsers = createAsyncThunk<[], {params:null}, {rejectValue: string}>(
    'user/fetchUsers',
    async(params, {rejectWithValue }) => {
        try {
            const response = await api.get('/inventory/users/',{params});
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch users');
        }
    }
)


export const fetchUser = createAsyncThunk<[], number, { rejectValue: string }>(
    'user/fetchUser',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/inventory/users/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const createUser = createAsyncThunk<[],  formData  , { rejectValue: string }>(
    'user/createUser',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/inventory/users/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const updateUser = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'user/updateUser',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/inventory/users/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
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
        .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<[]>) => {
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
                    .addCase(fetchUser.fulfilled, (state, action: PayloadAction<[]>) => {
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
                    .addCase(createUser.fulfilled, (state, action: PayloadAction<[]>) => {
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
                    .addCase(updateUser.fulfilled, (state, action: PayloadAction<[]>) => {
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