import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface Tokens {
    access: string;
    refresh: string;
}

interface AuthState {
    tokens: Tokens | null;
    last_route: string | null;
}

const initialState: AuthState = {
    tokens: null,
    last_route: null,
};


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setTokens: (state, action: PayloadAction<Tokens>) => {
            state.tokens = action.payload;
        },
        clearTokens: (state) => {
            state.tokens = null;
        },
    },
})


export const logout = createAsyncThunk<void, void, { rejectValue: any }>(
    'auth/logout',
    async (_, { dispatch }) => {
        try {
            dispatch(clearTokens());
        }
        catch (error) {

            if (error instanceof AxiosError) {
                throw new Error(error?.response?.data || "Logout failed");
            }
            throw new Error('An error occured');
        }
    }
)
export const { setTokens, clearTokens } = authSlice.actions;
export default authSlice.reducer;