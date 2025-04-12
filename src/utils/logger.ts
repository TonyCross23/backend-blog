import pino from "pino";
import dayjs from "dayjs";

const logger = pino({
  base: undefined,
  timestamp: () => `,"time":"${dayjs().format()}"`,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      ignore: "pid,hostname",
    },
  },
});
export default logger;
