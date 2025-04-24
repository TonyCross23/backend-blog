import express, { Request, Response } from "express";
import log from "../logger/logger";
import config from "config";
import connect from "./database/connect";
import createServer from "./server";
import { restResponseTimeHistogram } from "./metrics";
import responseTime from "response-time"

const port = config.get("port") as string;
const host = config.get("host") as string;

const app = createServer()

app.use(
  responseTime((req: Request, res: Response, time: number) => {
    if (req?.route?.path) {
      restResponseTimeHistogram.observe(
        {
          method: req.method,
          route: req.route.path,
          status_code: res.statusCode,
        },
        time * 1000
      );
    }
  })
);

app.listen(port, async () => {
  log.info(`Server is running on http://${host}:${port}`);
  await connect();
});
