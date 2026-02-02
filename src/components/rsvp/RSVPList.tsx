import { useEffect } from 'react';
import { useRSVP } from '../../hooks/useRSVP';
import { Loading } from '../common/Loading';
import { Card } from '../common/Card';

interface RSVPListProps {
  refreshTrigger?: number;
}

export function RSVPList({ refreshTrigger }: RSVPListProps = {}) {
  const { rsvps, loading, getAttendingCount, refreshRSVPs } = useRSVP();

  useEffect(() => {
    if (refreshTrigger) {
      refreshRSVPs();
    }
  }, [refreshTrigger, refreshRSVPs]);

  if (loading) {
    return <Loading message="Loading RSVPs..." />;
  }

  const attendingCount = getAttendingCount();
  const attendingRSVPs = rsvps.filter((r) => r.attending);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="stamp text-2xl inline-block bg-vintage-yellow">
          {attendingCount} {attendingCount === 1 ? 'Guest' : 'Guests'} Attending
        </div>
      </div>

      {attendingRSVPs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {attendingRSVPs.map((rsvp) => (
            <Card key={rsvp.id}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">{rsvp.name}</h3>
                  <p className="text-sm text-gray-600">
                    Party of {rsvp.partySize}
                  </p>
                </div>
                <div className="text-3xl">🎉</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
