import pino from "pino";

const logger = pino({
  transport: {
    target: "pino-pretty", // remove this in production
    options: {
      colorize: true,
    },
  },
});

export default logger;
