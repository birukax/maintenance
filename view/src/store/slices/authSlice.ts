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
        clearTokens: (state) => {
            state.tokens = null;
        },
    },
})


export const logout = () => async (dispatch) => {
    dispatch(clearTokens());
    window.location.href = '/login';
}


export const { setTokens, clearTokens } = authSlice.actions;
export default authSlice.reducer;