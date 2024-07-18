import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface BuyerRouteProps {
  children?: React.ReactNode;
}

const BuyerRoute: React.FC<BuyerRouteProps> = () => {
  const { user } = useSelector((state: any) => state.user);

  return user?.role === 'buyer' ? <Outlet /> : <Navigate to="/" />;
};

export default BuyerRoute;
