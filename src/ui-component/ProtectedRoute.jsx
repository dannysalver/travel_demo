import { Navigate, useLocation } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { getLandingPath } from 'utils/auth';

export default function ProtectedRoute({ roles, children }) {
  const { user, role } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to={getLandingPath(role)} replace />;
  }

  return children;
}
