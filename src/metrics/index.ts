import express, { Request, Response } from "express";
import client from "prom-client";
import log from "../logger/logger";

const app = express();

export const restResponseTimeHistogram = new client.Histogram({
  name: "rest_response_time_duration_seconds",
  help: "REST API response time in seconds",
  labelNames: ["method", "route", "status_code"],
});

export const databaseResponseTimeHistogram = new client.Histogram({
  name: "db_response_time_duration_seconds",
  help: "Database response time in seconds",
  labelNames: ["operation", "success"],
});

export function startMetricsServer() {
  const collectDefaultMetrics = client.collectDefaultMetrics;

  collectDefaultMetrics();

  app.get("/metrics", (req: Request, res: Response) => {
    res.set("Content-Type", client.register.contentType);

    client.register
      .metrics()
      .then((metrics) => {
        res.send(metrics);
      })
      .catch((err) => {
        res.status(500).send(err.message);
      });
  });

  app.listen(9100, () => {
    log.info("Metrics server started at http://localhost:9100");
  });
}
