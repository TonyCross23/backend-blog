import express from "express";
import deserializeUser from "./middlewares/deserializeUser";
import route from "./route";
import { startMetricsServer } from "./metrics";

function createServer() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(deserializeUser);
  route(app);
  startMetricsServer();

  return app;
}

export default createServer;
