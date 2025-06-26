import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const generateScript = createAsyncThunk(
  'resumeScript/generateScript',
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/resume-scripts/generate',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`, // 🔐 Add token here
          },
          withCredentials: true,
        }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Generation failed');
    }
  }
);


const resumeScriptSlice = createSlice({
  name: 'resumeScript',
  initialState: { script: '', loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateScript.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateScript.fulfilled, (state, action) => {
        state.loading = false;
        state.script = action.payload;
      })
      .addCase(generateScript.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default resumeScriptSlice.reducer;
