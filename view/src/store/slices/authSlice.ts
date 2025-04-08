import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';

interface Tokens {
    access: string;
    refresh: string;
}



interface AuthState {
    tokens: Tokens | null;
}

const initialState: AuthState = {
    tokens: null,
};


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setTokens: (state, action: PayloadAction<Tokens>) => {
            state.tokens = action.payload;
        },
        logout: (state) => {
            state.tokens = null;
        },
    },
})

export const { setTokens, logout } = authSlice.actions;
export default authSlice.reducer;