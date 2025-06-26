import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = "http://localhost:5000/api/auth/";

const initialState = {
  user: null,
  accessToken: null,
  isLoading: false,
  isError: false,
  errorMessage: '',
  otpSent: false,
};

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
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Logout Failed' });
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetError(state) {
      state.isError = false;
      state.errorMessage = '';
    }
  },
  extraReducers: (builder) => {
    builder

      //sendOtp
      .addCase(sendOtp.pending, (state) => { state.isLoading = true; })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpSent = true;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message;
      })

      // registerUser
      .addCase(registerUser.pending, (state) => { state.isLoading = true; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message;
      })

      // loginUser
      .addCase(loginUser.pending, (state) => { state.isLoading = true; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message;
      })

      // googleLogin
      .addCase(googleLogin.pending, (state) => { state.isLoading = true; })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
        state.accessToken = action.payload.data.accessToken;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message;
      })

      // refreshAccessToken
      // refreshAccessToken
      .addCase(refreshAccessToken.pending, () => {
        console.log("⏳ Refresh token request sent...");
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        console.log("✅ Token refreshed:", action.payload); // <--- add this
        state.accessToken = action.payload?.data?.accessToken;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        console.log("❌ Refresh token failed:", action.payload); // <--- add this
        state.isError = true;
        state.errorMessage = action.payload?.message;
      })


      // logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
      });
  }
})


export const { resetError } = authSlice.actions;
export default authSlice.reducer;