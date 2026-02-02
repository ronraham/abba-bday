import { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { useRSVP } from '../../hooks/useRSVP';
import { usePlaylist } from '../../hooks/usePlaylist';
import { useAuth } from '../../hooks/useAuth';
import { IoLogOut, IoTrash, IoPencil } from 'react-icons/io5';
import type { RSVP } from '../../types';

export function AdminPanel() {
  const { rsvps, getAttendingCount, deleteRSVP, updateRSVP } = useRSVP();
  const { songs, deleteSong } = usePlaylist();
  const { logout } = useAuth();

  const [editingRSVP, setEditingRSVP] = useState<RSVP | null>(null);
  const [editForm, setEditForm] = useState({ name: '', partySize: 1, attending: true, notes: '' });

  const attendingCount = getAttendingCount();

  const handleEditClick = (rsvp: RSVP) => {
    setEditingRSVP(rsvp);
    setEditForm({
      name: rsvp.name,
      partySize: rsvp.partySize,
      attending: rsvp.attending,
      notes: rsvp.notes || '',
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRSVP) return;

    try {
      await updateRSVP(editingRSVP.id, {
        name: editForm.name.trim(),
        partySize: editForm.partySize,
        attending: editForm.attending,
        notes: editForm.notes.trim() || undefined,
      });
      setEditingRSVP(null);
    } catch (err) {
      alert('Failed to update RSVP');
    }
  };

  const handleDeleteRSVP = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}'s RSVP?`)) {
      try {
        await deleteRSVP(id);
      } catch (err) {
        alert('Failed to delete RSVP');
      }
    }
  };

  const handleDeleteSong = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteSong(id);
      } catch (err) {
        alert('Failed to delete song');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display font-bold">Admin Dashboard</h2>
        <Button variant="secondary" onClick={logout}>
          <IoLogOut className="inline mr-2" /> Logout
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-4xl font-bold text-vintage-orange">{attendingCount}</div>
            <div className="text-sm text-gray-600 mt-2">Guests Attending</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-4xl font-bold text-vintage-orange">{songs.length}</div>
            <div className="text-sm text-gray-600 mt-2">Songs in Playlist</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-4xl font-bold text-vintage-orange">{rsvps.length}</div>
            <div className="text-sm text-gray-600 mt-2">Total RSVPs</div>
          </div>
        </Card>
      </div>

      {/* RSVPs Table */}
      <div>
        <h3 className="text-2xl font-display font-bold mb-4">RSVPs Management</h3>
        <div className="bg-white border-2 border-dark shadow-vintage overflow-x-auto">
          <table className="w-full">
            <thead className="bg-vintage-yellow border-b-2 border-dark">
              <tr>
                <th className="px-4 py-3 text-left font-bold">Name</th>
                <th className="px-4 py-3 text-left font-bold">Status</th>
                <th className="px-4 py-3 text-left font-bold">Party Size</th>
                <th className="px-4 py-3 text-left font-bold">Notes</th>
                <th className="px-4 py-3 text-left font-bold">Date</th>
                <th className="px-4 py-3 text-center font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rsvps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-600">
                    No RSVPs yet
                  </td>
                </tr>
              ) : (
                rsvps.map((rsvp, index) => (
                  <tr
                    key={rsvp.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-cream'}
                  >
                    <td className="px-4 py-3 font-medium">{rsvp.name}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-bold border ${
                          rsvp.attending
                            ? 'bg-green-100 border-green-600 text-green-800'
                            : 'bg-red-100 border-red-600 text-red-800'
                        }`}
                      >
                        {rsvp.attending ? 'Attending' : 'Not Attending'}
                      </span>
                    </td>
                    <td className="px-4 py-3">{rsvp.attending ? rsvp.partySize : '-'}</td>
                    <td className="px-4 py-3 max-w-xs truncate text-sm">
                      {rsvp.notes || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(rsvp.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEditClick(rsvp)}
                          className="p-2 hover:bg-gray-100 rounded transition-colors"
                          title="Edit"
                        >
                          <IoPencil size={18} className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteRSVP(rsvp.id, rsvp.name)}
                          className="p-2 hover:bg-gray-100 rounded transition-colors"
                          title="Delete"
                        >
                          <IoTrash size={18} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Songs Table */}
      <div>
        <h3 className="text-2xl font-display font-bold mb-4">Songs with Private Messages</h3>
        <div className="bg-white border-2 border-dark shadow-vintage overflow-x-auto">
          <table className="w-full">
            <thead className="bg-vintage-orange text-white border-b-2 border-dark">
              <tr>
                <th className="px-4 py-3 text-left font-bold">Thumbnail</th>
                <th className="px-4 py-3 text-left font-bold">Song</th>
                <th className="px-4 py-3 text-left font-bold">Artist</th>
                <th className="px-4 py-3 text-left font-bold">Dedicated By</th>
                <th className="px-4 py-3 text-left font-bold">Public Message</th>
                <th className="px-4 py-3 text-left font-bold">Private Message</th>
                <th className="px-4 py-3 text-center font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {songs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-600">
                    No songs yet
                  </td>
                </tr>
              ) : (
                songs.map((song, index) => (
                  <tr
                    key={song.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-cream'}
                  >
                    <td className="px-4 py-3">
                      <img
                        src={song.thumbnailUrl}
                        alt={song.title}
                        className="w-20 h-14 object-cover border-2 border-dark"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium max-w-xs">
                      <div className="line-clamp-2">{song.title}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">{song.artist}</td>
                    <td className="px-4 py-3 text-sm">{song.dedicatedBy}</td>
                    <td className="px-4 py-3 max-w-sm">
                      <div className="text-sm italic text-gray-700 line-clamp-2">
                        {song.happyBirthdayWords || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-sm">
                      <div className="text-sm bg-vintage-yellow/20 p-2 rounded line-clamp-2">
                        {song.dedicationMessage || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleDeleteSong(song.id, song.title)}
                          className="p-2 hover:bg-gray-100 rounded transition-colors"
                          title="Delete"
                        >
                          <IoTrash size={18} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit RSVP Modal */}
      <Modal
        isOpen={editingRSVP !== null}
        onClose={() => setEditingRSVP(null)}
        title="Edit RSVP"
        size="md"
      >
        <form onSubmit={handleEditSubmit} className="space-y-6">
          <Input
            label="Name"
            required
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            placeholder="Guest name"
          />

          <div>
            <label className="block text-sm font-bold mb-2 text-dark">
              Attendance Status <span className="text-vintage-red">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  checked={editForm.attending}
                  onChange={() => setEditForm({ ...editForm, attending: true })}
                  className="w-5 h-5 mr-2 accent-vintage-orange"
                />
                <span className="font-medium">Attending</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  checked={!editForm.attending}
                  onChange={() => setEditForm({ ...editForm, attending: false })}
                  className="w-5 h-5 mr-2 accent-vintage-orange"
                />
                <span className="font-medium">Not Attending</span>
              </label>
            </div>
          </div>

          {editForm.attending && (
            <Input
              label="Number of Guests"
              type="number"
              min="1"
              required
              value={editForm.partySize}
              onChange={(e) =>
                setEditForm({ ...editForm, partySize: parseInt(e.target.value) || 1 })
              }
            />
          )}

          <Textarea
            label="Notes (optional)"
            value={editForm.notes}
            onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
            placeholder="Additional notes..."
            rows={3}
          />

          <div className="flex gap-3">
            <Button type="submit" fullWidth>
              Save Changes
            </Button>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => setEditingRSVP(null)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
