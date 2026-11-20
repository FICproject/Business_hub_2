import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser, ICartItem, INotification, UserRole } from '../types';

interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  activeRole: UserRole | null;
  loading: boolean;
}

const savedToken = localStorage.getItem('business_hub_token');
const savedUser = localStorage.getItem('business_hub_user');

const initialUser: IUser | null = savedUser ? JSON.parse(savedUser) : null;

const initialAuthState: AuthState = {
  user: initialUser,
  token: savedToken,
  isAuthenticated: !!savedToken && !!initialUser,
  activeRole: initialUser?.roles ? initialUser.roles[0] : null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: IUser; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.activeRole = action.payload.user.roles[0] || 'normal';
      localStorage.setItem('business_hub_token', action.payload.token);
      localStorage.setItem('business_hub_user', JSON.stringify(action.payload.user));
    },
    setActiveRole: (state, action: PayloadAction<UserRole>) => {
      state.activeRole = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<IUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('business_hub_user', JSON.stringify(state.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.activeRole = null;
      localStorage.removeItem('business_hub_token');
      localStorage.removeItem('business_hub_user');
    },
  },
});

interface CartState {
  items: ICartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}

const initialCartState: CartState = {
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
  itemCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: initialCartState,
  reducers: {
    setCart: (
      state,
      action: PayloadAction<{ items: ICartItem[]; subtotal: number; tax: number; shipping: number; total: number }>
    ) => {
      state.items = action.payload.items;
      state.subtotal = action.payload.subtotal;
      state.tax = action.payload.tax;
      state.shipping = action.payload.shipping;
      state.total = action.payload.total;
      state.itemCount = action.payload.items.reduce((acc, i) => acc + i.quantity, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.tax = 0;
      state.shipping = 0;
      state.total = 0;
      state.itemCount = 0;
    },
  },
});

interface NotificationState {
  notifications: INotification[];
  unreadCount: number;
}

const initialNotificationState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: initialNotificationState,
  reducers: {
    setNotifications: (
      state,
      action: PayloadAction<{ notifications: INotification[]; unreadCount: number }>
    ) => {
      state.notifications = action.payload.notifications;
      state.unreadCount = action.payload.unreadCount;
    },
  },
});

export const { setCredentials, setActiveRole, updateUser, logout } = authSlice.actions;
export const { setCart, clearCart } = cartSlice.actions;
export const { setNotifications } = notificationSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    cart: cartSlice.reducer,
    notifications: notificationSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
