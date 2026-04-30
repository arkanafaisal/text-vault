import pino from 'pino'



const isDev = process.env.NODE_ENV === 'development'

export const logger = pino({
  level: isDev ? 'debug' : process.env.LOG_LEVEL || 'info',
  base: isDev
    ? null      // remove pid, hostname
    : undefined,
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: { colorize: true }
      }
    : undefined
})