import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshAccessToken } from '@/features/auth/authSlice'; // ✅ Your thunk
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);

  // 👇 Try to refresh token on first load
  useEffect(() => {
    console.log("🔁 Dispatching refreshAccessToken...");
    dispatch(refreshAccessToken());
  },[]);


  // ⏳ Wait while token is being checked
  if (isLoading) return <div className="p-10">Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
