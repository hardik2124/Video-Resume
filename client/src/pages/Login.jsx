import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { googleLogin, loginUser } from '@/features/auth/authSlice';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';


const Login = () => {
  const dispatch = useDispatch();
  const { isLoading, isError, errorMessage } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-[#ecf0f3] px-4">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl p-8 sm:p-10">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          🔐 Login to <span className="text-indigo-600">Video Resume</span>
        </h2>

        {isError && (
          <div className="text-sm text-red-600 bg-red-100 px-4 py-2 rounded mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-500">
          Don’t have an account?{' '}
          <a href="/register" className="text-indigo-600 font-medium hover:underline">
            Register
          </a>
        </p>

        <hr className="my-6 border-gray-300" />

        
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const token = credentialResponse.credential;
              const user = jwtDecode(token); // Optional: see name/email

              console.log("Google user:", user);

              dispatch(googleLogin(token));
            }}
            onError={() => {
              console.error('Google Register Failed');
            }}
          />
        

      </div>
    </div>
  );
};

export default Login;
