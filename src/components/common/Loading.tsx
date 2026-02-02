interface LoadingProps {
  message?: string;
}

export function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-dark/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-vintage-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-dark font-medium">{message}</p>
    </div>
  );
}
