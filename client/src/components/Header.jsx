import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="header">
      <nav>
        <h2 className="logo">TaskApp</h2>
        <ul className="nav-links">
          {token ? (
            <>
              <li><span>Përshëndetje, {user?.name}</span></li>
              <li><Link to="/">Dashboard</Link></li>
              <li><button onClick={handleLogout}>Dil</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Hyr</Link></li>
              <li><Link to="/register">Regjistrohu</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;