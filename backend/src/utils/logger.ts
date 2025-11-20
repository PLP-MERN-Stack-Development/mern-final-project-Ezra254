type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const levelPriority: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const currentLevel = (process.env.LOG_LEVEL as LogLevel) ?? 'info';

const shouldLog = (level: LogLevel) => levelPriority[level] >= levelPriority[currentLevel];

const format = (level: LogLevel, message: string) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
};

export const logger = {
  debug: (message: string, meta?: unknown) => {
    if (shouldLog('debug')) {
      console.debug(format('debug', message), meta ?? '');
    }
  },
  info: (message: string, meta?: unknown) => {
    if (shouldLog('info')) {
      console.info(format('info', message), meta ?? '');
    }
  },
  warn: (message: string, meta?: unknown) => {
    if (shouldLog('warn')) {
      console.warn(format('warn', message), meta ?? '');
    }
  },
  error: (message: string, meta?: unknown) => {
    if (shouldLog('error')) {
      console.error(format('error', message), meta ?? '');
    }
  },
};

