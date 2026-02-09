
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Retrieve user information and token from local storage
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

// Check and existing guest ID in local storage or create a new one
const initialGuestId = localStorage.getItem('guestId') || `guest_${new Date().getTime()}`;
localStorage.setItem('guestId', initialGuestId);

// Initial state
const initialState = {
  userInfo: userInfoFromStorage,
  guestId: initialGuestId,
  loading: false,
  error: null,
};

// Create async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        userData
      );
      localStorage.setItem('userInfo', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      return response.data.user; // Return user object from response
    } catch (error) {
      // Handle error robustly
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: error.message || 'Login failed' });
      }
    }
  }
);

// Create async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        userData
      );
      localStorage.setItem('userInfo', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      return response.data.user; // Return user object from response
    } catch (error) {
      // Handle error robustly
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: error.message || 'Registration failed' });
      }
    }
  }
);

// Slice for logout and guest ID
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      state.guestId = `guest_${new Date().getTime()}`; // Reset guest ID on logout
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      localStorage.setItem('guestId', state.guestId); // Set new guest ID in local storage
    },
    generateNewGuestId: (state) => {
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.setItem('guestId', state.guestId); // Set new guest ID in local storage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload?.error || 'Login failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload?.error || 'Registration failed';
      });
  }
});

export const { logout, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;