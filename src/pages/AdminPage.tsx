import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminPanel } from '../components/admin/AdminPanel';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/common/Loading';

export function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loading message="Checking authentication..." />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b-4 border-dark shadow-vintage relative">
        <div className="container mx-auto px-4 py-6">
          {/* Back to Home Button - Top Left */}
          <button
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded transition-colors"
          >
            ← Back to Home
          </button>

          <h1 className="text-3xl font-display font-bold text-center">Admin Panel</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <AdminPanel />
      </main>
    </div>
  );
}
