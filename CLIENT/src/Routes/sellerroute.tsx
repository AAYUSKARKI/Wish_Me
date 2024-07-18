import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface SellerRouteProps {
  children?: React.ReactNode;
}

const SellerRoute: React.FC<SellerRouteProps> = () => {
  const { user } = useSelector((state: any) => state.user);

  return user?.role === 'seller' ? <Outlet /> : <Navigate to="/" />;
};

export default SellerRoute;