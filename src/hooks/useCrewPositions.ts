import { useEffect, useRef, useState } from 'react';

export interface CrewPosition {
  crewId: string;
  lat: number;
  lon: number;
  timestamp: number;
  updatedAt: string;
  stale: boolean;
}

const POLL_INTERVAL_MS = 10_000;

/**
 * Polls the `/api/positions` Azure Function (backed by Table Storage) for
 * the latest reported location of every crew running Traccar Client.
 *
 * Table Storage has no realtime push/subscription, so we poll on a short
 * interval instead - trivial in cost/traffic at this scale (a handful of
 * crews, a few KB per response).
 */
export function useCrewPositions(): CrewPosition[] {
  const [positions, setPositions] = useState<CrewPosition[]>([]);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    async function poll() {
      try {
        const res = await fetch('/api/positions', { cache: 'no-store' });
        if (!res.ok) return;
        const data: CrewPosition[] = await res.json();
        if (isMounted.current) setPositions(data);
      } catch {
        // Network hiccup or offline - keep showing the last known positions
        // and try again on the next tick.
      }
    }

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, []);

  return positions;
}
