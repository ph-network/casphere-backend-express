import winston from "winston";
import morgan from "morgan";
const { combine, timestamp, printf, colorize, align } = winston.format;

export const logger = winston.createLogger({
  level: process.env.LOG,
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console()
  ]
})

export const morganMiddleware = morgan(
  'tiny',
  {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }
)