import { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { YouTubePlayer } from './YouTubePlayer';
import type { Song } from '../../types';
import { IoPlay, IoTrash } from 'react-icons/io5';

interface SongCardProps {
  song: Song;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

export function SongCard({ song, isAdmin = false, onDelete }: SongCardProps) {
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <>
      <Card className="h-full flex flex-col">
        <div className="relative mb-4 group">
          <img
            src={song.thumbnailUrl}
            alt={song.title}
            className="w-full h-48 object-cover border-2 border-dark"
          />
          <button
            onClick={() => setShowPlayer(true)}
            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Play song"
          >
            <IoPlay size={48} className="text-white" />
          </button>
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-bold text-lg line-clamp-2">{song.title}</h3>
            <p className="text-sm text-gray-600">{song.artist}</p>
          </div>

          <div className="text-sm">
            <p className="text-gray-500">Dedicated by:</p>
            <p className="font-medium">{song.dedicatedBy}</p>
          </div>

          {song.happyBirthdayWords && (
            <div className="text-sm">
              <p className="text-gray-500">Birthday wish:</p>
              <p className="italic text-gray-700">&ldquo;{song.happyBirthdayWords}&rdquo;</p>
            </div>
          )}

          {isAdmin && song.dedicationMessage && (
            <div className="text-sm p-3 bg-vintage-yellow/20 border border-vintage-yellow rounded">
              <p className="text-gray-500 font-bold">Private message:</p>
              <p className="italic text-gray-700">&ldquo;{song.dedicationMessage}&rdquo;</p>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t-2 border-dark/10 flex gap-2">
          <Button variant="secondary" onClick={() => setShowPlayer(true)} className="flex-1">
            <IoPlay className="inline mr-2" /> Play
          </Button>
          {isAdmin && onDelete && (
            <Button variant="danger" onClick={() => onDelete(song.id)}>
              <IoTrash size={18} />
            </Button>
          )}
        </div>
      </Card>

      <Modal
        isOpen={showPlayer}
        onClose={() => setShowPlayer(false)}
        title={song.title}
        size="lg"
      >
        <YouTubePlayer videoId={song.youtubeId} title={song.title} />
        <div className="mt-4 space-y-2">
          <p className="text-sm">
            <span className="font-bold">Artist:</span> {song.artist}
          </p>
          <p className="text-sm">
            <span className="font-bold">Dedicated by:</span> {song.dedicatedBy}
          </p>
          {song.happyBirthdayWords && (
            <p className="text-sm italic">&ldquo;{song.happyBirthdayWords}&rdquo;</p>
          )}
          {isAdmin && song.dedicationMessage && (
            <div className="mt-3 p-3 bg-vintage-yellow/20 border border-vintage-yellow rounded">
              <p className="font-bold text-sm mb-1">Private message:</p>
              <p className="text-sm italic">&ldquo;{song.dedicationMessage}&rdquo;</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
