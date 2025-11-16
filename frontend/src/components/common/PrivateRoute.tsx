import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

const PrivateRoute = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
