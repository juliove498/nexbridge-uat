import { Navigate, Outlet } from 'react-router-dom';
import { AdminSessionProvider, useAdminSession } from '../../context/AdminSessionContext';

function AdminGuard() {
  const { user, loading } = useAdminSession();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

/** Wraps admin routes: provides AdminSessionContext and redirects unauthenticated users. */
export function AdminLayout() {
  return (
    <AdminSessionProvider>
      <AdminGuard />
    </AdminSessionProvider>
  );
}
