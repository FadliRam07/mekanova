import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Memeriksa status login...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export function AdminRoute({ children }) {
  const { user, profile, loading } = useAuth();

  // Tunggu sampai loading selesai
  if (loading) return <div className="min-h-screen flex items-center justify-center">Memeriksa akses admin...</div>;
  
  // Jika belum login ATAU role-nya bukan admin, tendang ke beranda
  if (!user || profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}