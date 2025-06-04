import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../slices/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { name, email, password } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', { name, email, password });
      dispatch(setCredentials({ user: res.data, token: res.data.token }));
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Gabim në regjistrim');
    }
  };

  return (
    <div className="auth-container">
      <h2>Regjistrohu</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Emri" value={name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Fjalëkalimi" value={password} onChange={handleChange} required />
        <button type="submit">Krijo Llogari</button>
      </form>
    </div>
  );
};

export default Register;