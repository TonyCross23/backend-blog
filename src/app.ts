import express from "express";
import config from "config";
import logger from "./utils/logger";
import connect from "./utils/connect";

const port = config.get<number>("port");
const host = config.get<string>("host");

const app = express();

app.listen(port, async () => {
  logger.info(`server is running on http://${host}:${port}`);
  await connect();
});
