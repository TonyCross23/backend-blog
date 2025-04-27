"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger/logger"));
const default_1 = __importDefault(require("./config/default"));
const connect_1 = __importDefault(require("./database/connect"));
const server_1 = __importDefault(require("./server"));
const metrics_1 = require("./metrics");
const response_time_1 = __importDefault(require("response-time"));
const swagger_1 = __importDefault(require("./swagger/swagger"));
const port = default_1.default.port.toString();
const host = default_1.default.host;
const app = (0, server_1.default)();
app.use((0, response_time_1.default)((req, res, time) => {
    var _a;
    if ((_a = req === null || req === void 0 ? void 0 : req.route) === null || _a === void 0 ? void 0 : _a.path) {
        metrics_1.restResponseTimeHistogram.observe({
            method: req.method,
            route: req.route.path,
            status_code: res.statusCode,
        }, time * 1000);
    }
}));
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info(`Server is running on http://${host}:${port}`);
    yield (0, connect_1.default)();
    (0, swagger_1.default)(app, port);
}));
