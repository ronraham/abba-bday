import { useState, FormEvent, useEffect, useRef } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Loading } from '../common/Loading';
import { YouTubePlayer } from './YouTubePlayer';
import { youtubeService } from '../../services/youtubeService';
import { usePlaylist } from '../../hooks/usePlaylist';
import type { YouTubeSearchResult, CreateSongInput } from '../../types';
import { IoSearch, IoMusicalNotes, IoArrowBack, IoPlay, IoCheckmark, IoLink } from 'react-icons/io5';
import { extractArtistFromTitle, extractYouTubeVideoId } from '../../utils/helpers';

interface SongSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSongAdded?: () => void;
}

type ModalStep = 'search' | 'dedication' | 'preview';

export function SongSearchModal({ isOpen, onClose, onSongAdded }: SongSearchModalProps) {
  const { addSong } = usePlaylist();
  const [step, setStep] = useState<ModalStep>('search');
  const [searchMode, setSearchMode] = useState<'text' | 'url'>('text');
  const [searchQuery, setSearchQuery] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [searchResults, setSearchResults] = useState<YouTubeSearchResult[]>([]);
  const [selectedSong, setSelectedSong] = useState<YouTubeSearchResult | null>(null);
  const [previewSong, setPreviewSong] = useState<YouTubeSearchResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimerRef = useRef<number | null>(null);

  const [dedicationData, setDedicationData] = useState({
    dedicatedBy: '',
    dedicationMessage: '',
    happyBirthdayWords: '',
  });

  // Debounced search effect
  useEffect(() => {
    if (searchMode === 'text' && searchQuery.trim().length > 2) {
      // Clear existing timer
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }

      // Set new timer
      debounceTimerRef.current = window.setTimeout(() => {
        performSearch(searchQuery);
      }, 500); // 500ms debounce

      return () => {
        if (debounceTimerRef.current) {
          window.clearTimeout(debounceTimerRef.current);
        }
      };
    } else if (searchMode === 'text' && searchQuery.trim().length === 0) {
      // Clear results when search is empty
      setSearchResults([]);
      setError(null);
    }
  }, [searchQuery, searchMode]);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;

    try {
      setSearching(true);
      setError(null);
      const results = await youtubeService.searchVideos(query);
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search songs');
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (searchMode === 'text') {
      performSearch(searchQuery);
    } else {
      handleUrlSubmit();
    }
  };

  const handleUrlSubmit = async () => {
    if (!youtubeUrl.trim()) return;

    const videoId = extractYouTubeVideoId(youtubeUrl);
    if (!videoId) {
      setError('Invalid YouTube URL. Please check the URL and try again.');
      return;
    }

    try {
      setSearching(true);
      setError(null);
      const videoDetails = await youtubeService.getVideoDetails(videoId);

      // Convert to search result format and auto-select
      const result: YouTubeSearchResult = {
        id: videoDetails.id,
        videoId: videoDetails.id,
        title: videoDetails.title,
        channelTitle: videoDetails.channelTitle,
        thumbnailUrl: videoDetails.thumbnailUrl,
        description: videoDetails.description,
      };

      // Auto-preview the video
      handlePreviewSong(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch video details');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectSong = (song: YouTubeSearchResult) => {
    setSelectedSong(song);
    setStep('dedication');
  };

  const handlePreviewSong = (song: YouTubeSearchResult) => {
    setPreviewSong(song);
    setStep('preview');
  };

  const handleSubmitDedication = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedSong || !dedicationData.dedicatedBy.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const songData: CreateSongInput = {
        youtubeId: selectedSong.videoId,
        title: selectedSong.title,
        artist: extractArtistFromTitle(selectedSong.title, selectedSong.channelTitle),
        thumbnailUrl: selectedSong.thumbnailUrl,
        dedicatedBy: dedicationData.dedicatedBy.trim(),
        dedicationMessage: dedicationData.dedicationMessage.trim(),
        happyBirthdayWords: dedicationData.happyBirthdayWords.trim(),
      };

      await addSong(songData);

      // Notify parent to refresh
      if (onSongAdded) {
        onSongAdded();
      }

      // Reset and close
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add song');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('search');
    setSearchMode('text');
    setSearchQuery('');
    setYoutubeUrl('');
    setSearchResults([]);
    setSelectedSong(null);
    setPreviewSong(null);
    setDedicationData({
      dedicatedBy: '',
      dedicationMessage: '',
      happyBirthdayWords: '',
    });
    setError(null);
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }
    onClose();
  };

  const handleBack = () => {
    setStep('search');
    setSelectedSong(null);
    setPreviewSong(null);
    setError(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        step === 'search'
          ? 'Add a Song to the Playlist'
          : step === 'preview'
          ? 'Preview Song'
          : 'Dedicate Your Song'
      }
      size="xl"
    >
      {step === 'search' ? (
        <div className="space-y-6">
          {/* Search Mode Toggle */}
          <div className="flex gap-2 border-b-2 border-gray-200 pb-2">
            <button
              type="button"
              onClick={() => {
                setSearchMode('text');
                setError(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                searchMode === 'text'
                  ? 'text-vintage-orange border-b-2 border-vintage-orange -mb-2'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <IoSearch size={18} />
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchMode('url');
                setError(null);
                setSearchResults([]);
              }}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                searchMode === 'url'
                  ? 'text-vintage-orange border-b-2 border-vintage-orange -mb-2'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <IoLink size={18} />
              Paste URL
            </button>
          </div>

          {/* Search Input */}
          {searchMode === 'text' ? (
            <div>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type to search for a song or artist..."
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Results appear as you type
              </p>
            </div>
          ) : (
            <form onSubmit={handleSearch} className="space-y-3">
              <Input
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="Paste YouTube URL here (e.g., https://youtube.com/watch?v=...)"
                className="w-full"
              />
              <Button type="submit" disabled={searching || !youtubeUrl.trim()} fullWidth>
                {searching ? 'Loading...' : 'Fetch Video'}
              </Button>
            </form>
          )}

          {error && (
            <div className="p-4 bg-vintage-red/10 border-2 border-vintage-red text-vintage-red rounded">
              {error}
            </div>
          )}

          {searching && <Loading message="Loading..." />}

          {!searching && searchMode === 'text' && searchResults.length > 0 && (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {searchResults.map((result) => (
                <Card key={result.id}>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <img
                      src={result.thumbnailUrl}
                      alt={result.title}
                      className="w-full sm:w-28 h-auto sm:h-20 object-cover border-2 border-dark flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm sm:text-base line-clamp-2">{result.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">{result.channelTitle}</p>
                      <div className="flex gap-2 mt-2 sm:mt-3">
                        <Button
                          variant="secondary"
                          onClick={() => handlePreviewSong(result)}
                          className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                        >
                          <IoPlay className="inline mr-1" /> Preview
                        </Button>
                        <Button
                          onClick={() => handleSelectSong(result)}
                          className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                        >
                          <IoCheckmark className="inline mr-1" /> Select
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!searching && searchMode === 'text' && searchQuery.length > 2 && searchResults.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              <IoMusicalNotes size={48} className="mx-auto mb-4 text-gray-400" />
              <p>No songs found. Try a different search term.</p>
            </div>
          )}
        </div>
      ) : step === 'preview' ? (
        <div className="space-y-6">
          <Button variant="secondary" onClick={() => setStep('search')} className="mb-4">
            <IoArrowBack className="inline mr-2" /> Back to Search
          </Button>

          {previewSong && (
            <div>
              <h3 className="font-bold text-lg mb-3">Preview:</h3>
              <div className="mb-6">
                <YouTubePlayer videoId={previewSong.videoId} title={previewSong.title} />
                <p className="mt-2 font-medium">{previewSong.title}</p>
                <p className="text-sm text-gray-600">{previewSong.channelTitle}</p>
              </div>
              <Button onClick={() => handleSelectSong(previewSong)} fullWidth>
                <IoCheckmark className="inline mr-2" /> Select This Song
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex gap-2 mb-4">
            <Button variant="secondary" onClick={handleBack}>
              <IoArrowBack className="inline mr-2" /> Back to Search
            </Button>
            {selectedSong && (
              <Button variant="secondary" onClick={() => handlePreviewSong(selectedSong)}>
                <IoPlay className="inline mr-2" /> Preview Again
              </Button>
            )}
          </div>

          {selectedSong && (
            <div>
              <h3 className="font-bold text-lg mb-3">Selected Song:</h3>
              <div className="mb-6">
                <YouTubePlayer videoId={selectedSong.videoId} title={selectedSong.title} />
                <p className="mt-2 font-medium">{selectedSong.title}</p>
                <p className="text-sm text-gray-600">{selectedSong.channelTitle}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmitDedication} className="space-y-6">
            <Input
              label="Your Name | שמך"
              required
              value={dedicationData.dedicatedBy}
              onChange={(e) =>
                setDedicationData({ ...dedicationData, dedicatedBy: e.target.value })
              }
              placeholder="Your name / השם שלך"
            />

            <Textarea
              label="Why this song? (Private message for Oren) | למה השיר הזה? (הודעה פרטית לאורן)"
              required
              value={dedicationData.dedicationMessage}
              onChange={(e) =>
                setDedicationData({ ...dedicationData, dedicationMessage: e.target.value })
              }
              placeholder="Share why this song is special and meaningful... / שתף למה השיר הזה מיוחד ומשמעותי..."
              rows={4}
            />

            <Textarea
              label="Happy Birthday Message (Public) | ברכת יום הולדת (ציבורית)"
              value={dedicationData.happyBirthdayWords}
              onChange={(e) =>
                setDedicationData({ ...dedicationData, happyBirthdayWords: e.target.value })
              }
              placeholder="A public birthday wish for everyone to see... / ברכת יום הולדת ציבורית לכולם לראות..."
              rows={3}
            />

            {error && (
              <div className="p-4 bg-vintage-red/10 border-2 border-vintage-red text-vintage-red rounded">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" fullWidth disabled={submitting}>
                {submitting ? 'Adding Song...' : 'Add to Playlist'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
}
