import React from 'react';
import { Outlet } from 'react-router-dom';

const InfoLayout = () => {
  return (
    <div className="auth-container">
      <Outlet />
    </div>
  );
};

export default InfoLayout;
