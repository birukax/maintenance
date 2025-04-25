import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface DataState {
    data: [] | null;
    loading: boolean;
    error: string | null;
}

interface ProfileState {
    profiles: DataState;
    profile: DataState;
}

const initialState: ProfileState = {
    profiles: {data: null, loading: false, error: null},
    profile: {data: null, loading: false, error: null},
};

export const fetchProfiles = createAsyncThunk<[], void, {rejectValue: string}>(
    'profile/fetchProfiles',
    async(_, {rejectWithValue }) => {
        try {
            const response = await api.get('/account/profiles/');
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch profiles');
        }
    }
)


export const fetchProfile = createAsyncThunk<[], number, { rejectValue: string }>(
    'profile/fetchProfile',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/account/profiles/${id}/`)
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const createProfile = createAsyncThunk<[],  formData  , { rejectValue: string }>(
    'profile/createProfile',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/account/profiles/', formData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const updateProfile = createAsyncThunk<[], { id: string, formData: { [key: string] } }, { rejectValue: string }>(
    'profile/updateProfile',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/account/profiles/${id}/`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)




const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    
    extraReducers: (builder) => {
        builder
        .addCase(fetchProfiles.pending, (state) => {
            state.profiles.loading = true;
            state.profiles.error = null;
        })
        .addCase(fetchProfiles.fulfilled, (state, action: PayloadAction<[]>) => {
            state.profiles.loading = false;
            state.profiles.data = action.payload;
        })
        .addCase(fetchProfiles.rejected, (state, action) => {
            state.profiles.loading = false;
            state.profiles.error = action.payload || 'Unknown error';
        })
        .addCase(fetchProfile.pending, (state) => {
                        state.profile.loading = true;
                        state.profile.error = null;
                    })
                    .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<[]>) => {
                        state.profile.loading = false;
                        state.profile.data = action.payload;
                    })
                    .addCase(fetchProfile.rejected, (state, action) => {
                        state.profile.loading = false;
                        state.profile.error = action.payload || 'Unknown error';
                    })
                    .addCase(createProfile.pending, (state) => {
                        state.profile.loading = true;
                        state.profile.error = null;
                    })
                    .addCase(createProfile.fulfilled, (state, action: PayloadAction<[]>) => {
                        state.profile.loading = false;
                        state.profile.data = action.payload;
                    })
                    .addCase(createProfile.rejected, (state, action) => {
                        state.profile.loading = false;
                        state.profile.error = action.payload || 'Unknown error';
                    })
                    .addCase(updateProfile.pending, (state) => {
                        state.profile.loading = true;
                        state.profile.error = null;
                    })
                    .addCase(updateProfile.fulfilled, (state, action: PayloadAction<[]>) => {
                        state.profile.loading = false;
                        state.profile.data = action.payload;
                    })
                    .addCase(updateProfile.rejected, (state, action) => {
                        state.profile.loading = false;
                        state.profile.error = action.payload || 'Unknown error';
                    })
                    
    }
})

// export const { createProfile, updateProfile, deleteProfile } = profileSlice.actions;
export default profileSlice.reducer;