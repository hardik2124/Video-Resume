import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = "http://localhost:6000/api/auth";

const initialState = {
  user: null,
  isLoading: false,
  isError: false,
  errorMessage: '',
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    
  }
)
