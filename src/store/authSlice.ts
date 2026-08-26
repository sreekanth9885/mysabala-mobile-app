import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
};

const initialState: AuthState = {
  token: null,
  user: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        token: string;
        user: User;
      }>,
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isLoggedIn = true;
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },

    logoutUser: state => {
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setCredentials, updateUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
