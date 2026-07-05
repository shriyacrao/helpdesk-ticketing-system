import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrap protected pages: <PrivateRoute roles={['admin']}><AdminPage /></PrivateRoute>
const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="page-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;

  return children;
};

export default PrivateRoute;
