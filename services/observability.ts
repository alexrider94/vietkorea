import { logError, logWarn } from '@/services/logger';

const ERROR_ALERT_THRESHOLD = 5;
let recentErrorCount = 0;

export function recordError(tag: string, error: unknown, context?: Record<string, unknown>) {
  recentErrorCount += 1;
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';

  logError(`Error captured: ${tag}`, {
    errorMessage,
    tag,
    count: recentErrorCount,
    ...context,
  });

  if (recentErrorCount >= ERROR_ALERT_THRESHOLD) {
    logWarn('Error threshold reached. Alerting required.', {
      threshold: ERROR_ALERT_THRESHOLD,
      current: recentErrorCount,
      tag,
    });
  }
}

export function resetErrorCounter() {
  recentErrorCount = 0;
}
