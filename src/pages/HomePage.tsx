import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RSVPForm } from '../components/rsvp/RSVPForm';
import { RSVPList } from '../components/rsvp/RSVPList';
import { PlaylistView } from '../components/playlist/PlaylistView';
import { AdminLogin } from '../components/admin/AdminLogin';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { IoShieldCheckmark } from 'react-icons/io5';
import { APP_CONFIG } from '../utils/constants';

export function HomePage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [activeSection, setActiveSection] = useState<'rsvp' | 'playlist'>('rsvp');
  const [rsvpRefreshTrigger, setRsvpRefreshTrigger] = useState(0);

  const handleRSVPAdded = () => {
    setRsvpRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header with Cassette Background */}
      <header
        className="bg-white border-b-4 border-dark shadow-vintage relative"
        style={{
          backgroundImage: 'url(/cassette-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-cream/65 backdrop-blur-sm"></div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Admin Button - Top Right */}
          <div className="absolute top-4 right-4">
            {!isAdmin ? (
              <button
                onClick={() => setShowAdminLogin(true)}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded transition-colors flex items-center gap-1.5"
              >
                <IoShieldCheckmark size={14} /> Admin
              </button>
            ) : (
              <button
                onClick={() => navigate('/admin')}
                className="px-3 py-1.5 text-xs font-medium text-white bg-vintage-orange hover:bg-vintage-orange/90 border border-dark rounded transition-colors flex items-center gap-1.5"
              >
                <IoShieldCheckmark size={14} /> Admin Panel
              </button>
            )}
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-display font-bold">
              OREN'S <span className="stamp text-4xl md:text-5xl bg-vintage-orange text-white mx-2">60</span>
            </h1>
            <p className="text-2xl md:text-3xl font-display italic">SAVE THE DATE</p>
            <div className="flex flex-col items-center gap-2">
              <p className="text-xl md:text-2xl font-bold">{APP_CONFIG.PARTY_DATE}</p>
              <p className="text-lg text-gray-600">{APP_CONFIG.PARTY_TIME}</p>
              <p className="text-sm text-gray-500 italic mt-2">STAY TUNED...</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-cream-dark border-b-2 border-dark sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-4 py-4">
            <Button
              variant={activeSection === 'rsvp' ? 'primary' : 'secondary'}
              onClick={() => setActiveSection('rsvp')}
            >
              RSVP
            </Button>
            <Button
              variant={activeSection === 'playlist' ? 'primary' : 'secondary'}
              onClick={() => setActiveSection('playlist')}
            >
              Playlist
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {activeSection === 'rsvp' ? (
          <div className="space-y-12">
            {/* RSVP Section */}
            <section>
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-display font-bold mb-4">Join the Celebration</h2>
                  <p className="text-lg text-gray-700">
                    Let us know if you can make it to Oren's 60th birthday party!
                  </p>
                </div>

                <div className="cassette-card p-8">
                  <RSVPForm onRSVPAdded={handleRSVPAdded} />
                </div>
              </div>
            </section>

            {/* Who's Coming Section */}
            <section>
              <div className="text-center mb-8">
                <h2 className="text-4xl font-display font-bold">Who's Coming</h2>
              </div>
              <RSVPList refreshTrigger={rsvpRefreshTrigger} />
            </section>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Playlist Section */}
            <section>
              <div className="text-center mb-8">
                <h2 className="text-4xl font-display font-bold mb-4">Musical Memories</h2>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                  Dedicate a song to Oren! Share a tune that reminds you of him or marks a
                  special moment. Add your personal message to make it extra special.
                </p>
              </div>
              <PlaylistView />
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg">Celebrating {APP_CONFIG.HONOREE_NAME}</p>
          <p className="text-sm text-gray-400 mt-2">
            {APP_CONFIG.PARTY_DATE} • {APP_CONFIG.PARTY_TIME}
          </p>
        </div>
      </footer>

      <AdminLogin isOpen={showAdminLogin} onClose={() => setShowAdminLogin(false)} />
    </div>
  );
}
