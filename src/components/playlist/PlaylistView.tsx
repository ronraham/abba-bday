import { useState } from 'react';
import { SongCard } from './SongCard';
import { SongSearchModal } from './SongSearchModal';
import { Button } from '../common/Button';
import { Loading } from '../common/Loading';
import { usePlaylist } from '../../hooks/usePlaylist';
import { useAuth } from '../../hooks/useAuth';
import { IoAdd, IoMusicalNotes } from 'react-icons/io5';

export function PlaylistView() {
  const { songs, loading, deleteSong, refreshPlaylist } = usePlaylist();
  const { isAdmin } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleSongAdded = () => {
    refreshPlaylist();
    setShowAddModal(false);
  };

  const handleDeleteSong = async (id: string) => {
    if (confirm('Are you sure you want to delete this song?')) {
      try {
        await deleteSong(id);
      } catch (err) {
        alert('Failed to delete song');
      }
    }
  };

  if (loading) {
    return <Loading message="Loading playlist..." />;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Button onClick={() => setShowAddModal(true)} className="inline-flex items-center">
          <IoAdd size={24} className="mr-2" />
          Add a Song to the Playlist
        </Button>
      </div>

      {songs.length === 0 ? (
        <div className="text-center py-12">
          <IoMusicalNotes size={64} className="mx-auto mb-4 text-gray-400" />
          <p className="text-xl text-gray-600">
            No songs yet. Be the first to add a song!
          </p>
        </div>
      ) : (
        <div>
          <div className="text-center mb-6">
            <div className="stamp text-xl inline-block bg-vintage-orange text-white">
              {songs.length} {songs.length === 1 ? 'Song' : 'Songs'} in Playlist
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {songs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                isAdmin={isAdmin}
                onDelete={isAdmin ? handleDeleteSong : undefined}
              />
            ))}
          </div>
        </div>
      )}

      <SongSearchModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSongAdded={handleSongAdded}
      />
    </div>
  );
}
