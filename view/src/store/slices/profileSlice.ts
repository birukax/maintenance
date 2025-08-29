import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { AxiosError } from "axios";
import { type FormData, type FetchParams, type UpdateFormData, type Data, type DataState, PaginatedData } from "../types";


interface ProfileState {
    profiles: DataState<PaginatedData<Data[]> | Data[] | []>;
    profile: DataState<Data | null>;
}

const initialState: ProfileState = {
    profiles: { data: [], loading: false, error: null },
    profile: { data: null, loading: false, error: null },
};

export const fetchProfiles = createAsyncThunk<PaginatedData<Data[]>, FetchParams, { rejectValue: any }>(
    'profile/fetchProfiles',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/account/profiles/', { params });
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch profiles');
            }
            return rejectWithValue('An error occured');
        }
    }
)


export const fetchProfile = createAsyncThunk<Data, number | string, { rejectValue: any }>(
    'profile/fetchProfile',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/account/profiles/${id}/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch profile');
            }
            return rejectWithValue('An error occured');
        }
    }
)
export const fetchUserProfile = createAsyncThunk<Data, void, { rejectValue: any }>(
    'profile/fetchUserProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`/account/profiles/get_user_profile/`)
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to fetch user profile');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const createProfile = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'profile/createProfile',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/account/profiles/', formData);
            return response.data;
        }
        catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to create profile');
            }
            return rejectWithValue('An error occured');
        }
    }
)

export const updateProfile = createAsyncThunk<Data, UpdateFormData, { rejectValue: any }>(
    'profile/updateProfile',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/account/profiles/${id}/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to update profile');
            }
            return rejectWithValue('An error occured');
        }
    }
)
export const resetPassword = createAsyncThunk<Data, FormData, { rejectValue: any }>(
    'profile/resetPassword',
    async ({ formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/account/profiles/change_password/`, formData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error?.response?.data || 'Failed to reset password');
            }
            return rejectWithValue('An error occured');
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
            .addCase(fetchProfiles.fulfilled, (state, action: PayloadAction<PaginatedData<Data[]>>) => {
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
            .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<Data>) => {
                state.profile.loading = false;
                state.profile.data = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.profile.loading = false;
                state.profile.error = action.payload || 'Unknown error';
            })
            .addCase(fetchUserProfile.pending, (state) => {
                state.profile.loading = true;
                state.profile.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<Data>) => {
                state.profile.loading = false;
                state.profile.data = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.profile.loading = false;
                state.profile.error = action.payload || 'Unknown error';
            })
            .addCase(createProfile.pending, (state) => {
                state.profile.loading = true;
                state.profile.error = null;
            })
            .addCase(createProfile.fulfilled, (state, action: PayloadAction<Data>) => {
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
            .addCase(updateProfile.fulfilled, (state, action: PayloadAction<Data>) => {
                state.profile.loading = false;
                state.profile.data = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.profile.loading = false;
                state.profile.error = action.payload || 'Unknown error';
            })
            .addCase(resetPassword.pending, (state) => {
                state.profile.loading = true;
                state.profile.error = null;
            })
            .addCase(resetPassword.fulfilled, (state, action: PayloadAction<Data>) => {
                state.profile.loading = false;
                state.profile.data = action.payload;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.profile.loading = false;
                state.profile.error = action.payload || 'Unknown error';
            })

    }
})

// export const { createProfile, updateProfile, deleteProfile } = profileSlice.actions;
export default profileSlice.reducer;