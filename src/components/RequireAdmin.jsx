import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RequireAdmin = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user || user.isAdmin !== true) {
      navigate('/'); // redirect to homepage if not admin
    }
  }, []);

  return <>{children}</>;
};

export default RequireAdmin;