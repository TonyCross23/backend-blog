"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deserializeUser_1 = __importDefault(require("./middlewares/deserializeUser"));
const route_1 = __importDefault(require("./route"));
const metrics_1 = require("./metrics");
function createServer() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(deserializeUser_1.default);
    (0, route_1.default)(app);
    (0, metrics_1.startMetricsServer)();
    return app;
}
exports.default = createServer;
