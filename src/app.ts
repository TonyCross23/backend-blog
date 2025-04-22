import express from "express";
import log from "../logger/logger";
import config from "config";
import connect from "./database/connect";
import createServer from "./server";

const port = config.get("port") as string;
const host = config.get("host") as string;

const app = createServer()

app.listen(port, async () => {
  log.info(`Server is running on http://${host}:${port}`);
  await connect();
});
