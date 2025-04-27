"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const package_json_1 = require("../../package.json");
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const logger_1 = __importDefault(require("../../logger/logger"));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "My Blog API",
            version: package_json_1.version,
        },
        components: {
            securitySchemes: {
                beareAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                beareAuth: [],
            },
        ],
    },
    apis: ["./src/route.ts", "./src/schemas/*.ts"],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
function swaggerDocs(app, port) {
    //swagger doc
    app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    // Docs in JSON format
    app.get("/docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
    logger_1.default.info(`Docs available at http://localhost:${port}/docs`);
}
exports.default = swaggerDocs;
