import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types/UserRole';
import { Navigate } from 'react-router-dom';

export function RoleRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signIn" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/catalog" replace />;
  }

  return children;
}
