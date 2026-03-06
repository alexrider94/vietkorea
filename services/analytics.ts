import { AnalyticsEvent, AnalyticsEventName } from '@/types/analytics';
import { logInfo } from '@/services/logger';

const eventBuffer: AnalyticsEvent[] = [];

export function trackEvent(
  name: AnalyticsEventName,
  payload?: Record<string, string | number | boolean | null | undefined>,
) {
  const event: AnalyticsEvent = {
    name,
    payload,
    timestamp: Date.now(),
  };

  eventBuffer.push(event);

  if (eventBuffer.length > 300) {
    eventBuffer.shift();
  }

  logInfo('analytics_event', {
    name,
    payload,
    buffered: eventBuffer.length,
  });
}

export function getAnalyticsSnapshot() {
  return [...eventBuffer];
}
