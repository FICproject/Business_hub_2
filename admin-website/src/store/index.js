import { configureStore, createSlice } from '@reduxjs/toolkit';
const savedToken = localStorage.getItem('business_hub_admin_token') || localStorage.getItem('business_hub_token');
const savedUser = localStorage.getItem('business_hub_admin_user') || localStorage.getItem('business_hub_user');
const initialAdminState = {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken,
    isAuthenticated: !!savedToken,
};
const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState: initialAdminState,
    reducers: {
        setAdminCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem('business_hub_admin_token', action.payload.token);
            localStorage.setItem('business_hub_admin_user', JSON.stringify(action.payload.user));
        },
        adminLogout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('business_hub_admin_token');
            localStorage.removeItem('business_hub_admin_user');
        },
    },
});
export const { setAdminCredentials, adminLogout } = adminAuthSlice.actions;
export const store = configureStore({
    reducer: {
        adminAuth: adminAuthSlice.reducer,
    },
});
