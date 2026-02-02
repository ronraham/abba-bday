interface YouTubePlayerProps {
  videoId: string;
  title?: string;
}

export function YouTubePlayer({ videoId, title }: YouTubePlayerProps) {
  return (
    <div className="aspect-video w-full">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title || 'YouTube video player'}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="border-2 border-dark"
      />
    </div>
  );
}
