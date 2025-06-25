import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaEnvelope, FaUser, FaLock, FaPaperPlane } from 'react-icons/fa';
import { googleLogin, registerUser, sendOtp } from '@/features/auth/authSlice';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const dispatch = useDispatch();
  const { isLoading, otpSent, isError, errorMessage } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    otp: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSendOtp = () => {
    if (!formData.email) return alert('Enter email first');
    dispatch(sendOtp(formData.email));
  };


  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(resultAction)) {
      navigate('/dashboard'); // ✅ Redirect on success
    }
  };



  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          🎥 Create Your <span className="text-primary">Video Resume</span> Account
        </h2>

        {isError && <div className="error-message">{errorMessage}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input-field"
          />
          <div className="flex gap-2">
            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
            />
            <button type="button" onClick={handleSendOtp} className="btn-secondary text-sm whitespace-nowrap">
              {otpSent ? 'Sent' : 'Send OTP'}
            </button>
          </div>
          <input
            name="otp"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={handleChange}
            required
            className="input-field"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="input-field"
          />
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <hr className="my-6 border-gray-300" />

        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            const token = credentialResponse.credential;
            const resultAction = await dispatch(googleLogin(token));

            if (googleLogin.fulfilled.match(resultAction)) {
              navigate('/dashboard');
            } else {
              console.error('Google login failed:', resultAction);
            }
          }}
          onError={() => {
            console.error('Google Register Failed');
          }}
        />

        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-primary hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>


  );
};

export default Register;
