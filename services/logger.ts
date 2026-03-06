type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
}

function writeLog(entry: LogEntry) {
  const prefix = `[vietkorea:${entry.level}] ${entry.timestamp} ${entry.message}`;
  if (entry.context && Object.keys(entry.context).length > 0) {
    console.log(prefix, JSON.stringify(entry.context));
    return;
  }
  console.log(prefix);
}

export function logInfo(message: string, context?: Record<string, unknown>) {
  writeLog({
    level: 'info',
    message,
    context,
    timestamp: new Date().toISOString(),
  });
}

export function logWarn(message: string, context?: Record<string, unknown>) {
  writeLog({
    level: 'warn',
    message,
    context,
    timestamp: new Date().toISOString(),
  });
}

export function logError(message: string, context?: Record<string, unknown>) {
  writeLog({
    level: 'error',
    message,
    context,
    timestamp: new Date().toISOString(),
  });
}
