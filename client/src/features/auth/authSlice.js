import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = "http://localhost:5000/api/auth/";

// ✅ Load auth data from localStorage
const storedAuth = localStorage.getItem('auth');
const parsedAuth = storedAuth ? JSON.parse(storedAuth) : null;

const initialState = {
  user: parsedAuth?.user || null,
  accessToken: parsedAuth?.accessToken || null,
  isLoading: false,
  isError: false,
  errorMessage: '',
  otpSent: false,
};

// ✅ Save helper
const saveAuthToStorage = (user, accessToken) => {
  localStorage.setItem('auth', JSON.stringify({ user, accessToken }));
};

// ✅ Async Thunks
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}register`, userData, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Server Error' });
    }
  }
);

export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}send-otp`, { email }, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Server Error' });
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}login`, userData, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Server Error' });
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}google-login`, { token }, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Server Error' });
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}refresh-token`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Token Refresh Failed' });
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}logout`, {}, { withCredentials: true });
      localStorage.removeItem('auth');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Logout Failed' });
    }
  }
);

// ✅ Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetError(state) {
      state.isError = false;
      state.errorMessage = '';
    },
    hydrateAuth(state) {
      const data = localStorage.getItem('auth');
      if (data) {
        const parsed = JSON.parse(data);
        state.user = parsed.user;
        state.accessToken = parsed.accessToken;
      }
    },
  },
  extraReducers: (builder) => {
    builder

      // Send OTP
      .addCase(sendOtp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.isLoading = false;
        state.otpSent = true;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message;
      })

      // Register User
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.accessToken = action.payload.accessToken;
        saveAuthToStorage(action.payload, action.payload.accessToken);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message;
      })

      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.accessToken = action.payload.accessToken;
        saveAuthToStorage(action.payload, action.payload.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message;
      })

      // Google Login
      .addCase(googleLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        const user = action.payload.data;
        const token = user.accessToken;
        state.user = user;
        state.accessToken = token;
        saveAuthToStorage(user, token);
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message;
      })

      // Refresh Token
      .addCase(refreshAccessToken.pending, () => {
        console.log("🔁 Refreshing access token...");
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        const newAccessToken = action.payload?.data?.accessToken;
        state.accessToken = newAccessToken;
        const auth = JSON.parse(localStorage.getItem('auth'));
        if (auth?.user) {
          saveAuthToStorage(auth.user, newAccessToken);
        }
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload?.message;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
      });
  }
});

export const { resetError, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
