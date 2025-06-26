import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import resumeScriptSliceReducer from '@/features/resumeScript/resumeScriptSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resumeScript:resumeScriptSliceReducer
  },
});
