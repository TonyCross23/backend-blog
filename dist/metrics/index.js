"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseResponseTimeHistogram = exports.restResponseTimeHistogram = void 0;
exports.startMetricsServer = startMetricsServer;
const express_1 = __importDefault(require("express"));
const prom_client_1 = __importDefault(require("prom-client"));
const logger_1 = __importDefault(require("../logger/logger"));
const app = (0, express_1.default)();
exports.restResponseTimeHistogram = new prom_client_1.default.Histogram({
    name: "rest_response_time_duration_seconds",
    help: "REST API response time in seconds",
    labelNames: ["method", "route", "status_code"],
});
exports.databaseResponseTimeHistogram = new prom_client_1.default.Histogram({
    name: "db_response_time_duration_seconds",
    help: "Database response time in seconds",
    labelNames: ["operation", "success"],
});
function startMetricsServer() {
    const collectDefaultMetrics = prom_client_1.default.collectDefaultMetrics;
    collectDefaultMetrics();
    app.get("/metrics", (req, res) => {
        res.set("Content-Type", prom_client_1.default.register.contentType);
        prom_client_1.default.register
            .metrics()
            .then((metrics) => {
            res.send(metrics);
        })
            .catch((err) => {
            res.status(500).send(err.message);
        });
    });
    app.listen(9100, () => {
        logger_1.default.info("Metrics server started at http://localhost:9100");
    });
}
