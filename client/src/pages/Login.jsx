import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../slices/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      dispatch(setCredentials({ user: res.data, token: res.data.token }));
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Gabim në hyrje');
    }
  };

  return (
    <div className="auth-container">
      <h2>Hyr</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Fjalëkalimi" value={password} onChange={handleChange} required />
        <button type="submit">Hyr</button>
      </form>
    </div>
  );
};

export default Login;