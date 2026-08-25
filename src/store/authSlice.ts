import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
}

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

      // Save asynchronously for persistence
      AsyncStorage.setItem('token', action.payload.token);

      AsyncStorage.setItem('user', JSON.stringify(action.payload.user));
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };

        AsyncStorage.setItem('user', JSON.stringify(state.user));
      }
    },

    logoutUser: state => {
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;

      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('user');
    },

    restoreCredentials: (
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
  },
});

export const { setCredentials, updateUser, logoutUser, restoreCredentials } =
  authSlice.actions;

export default authSlice.reducer;
