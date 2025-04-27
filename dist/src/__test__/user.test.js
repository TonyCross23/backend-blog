"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const mongoose_1 = __importDefault(require("mongoose"));
const UserService = __importStar(require("../services/user.service"));
const SessionService = __importStar(require("../services/session.service"));
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const session_controller_1 = require("../controllers/session.controller");
const app = (0, server_1.default)();
const userId = new mongoose_1.default.Types.ObjectId().toString();
const userPayload = {
    _id: userId,
    email: "jane.doe@example.com",
    name: "Jane Doe",
};
const userInput = {
    email: "test@example.com",
    name: "Jane Doe",
    password: "Password123",
    passwordConfirmation: "Password123",
};
const sessionPayload = {
    _id: new mongoose_1.default.Types.ObjectId().toString(),
    user: userId,
    valid: true,
    userAgent: "PostmanRuntime/7.28.4",
    createdAt: new Date("2021-09-30T13:31:07.674Z"),
    updatedAt: new Date("2021-09-30T13:31:07.674Z"),
    __v: 0,
};
describe("user", () => {
    //user registration
    describe("user registration", () => {
        describe("given the username and password are valid", () => {
            it("should return a user payload", () => __awaiter(void 0, void 0, void 0, function* () {
                const createUserServiceMock = jest
                    .spyOn(UserService, "createUser")
                    // @ts-ignore
                    .mockReturnValue(userPayload);
                const { statusCode, body } = yield (0, supertest_1.default)(app).post("/api/register").send(userInput);
                expect(statusCode).toBe(200);
                expect(body).toEqual(userPayload);
                expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
            }));
        });
    });
    describe("given the password do not match", () => {
        it("should return a 400 error", () => __awaiter(void 0, void 0, void 0, function* () {
            const createUserServiceMock = jest
                .spyOn(UserService, "createUser")
                // @ts-ignore
                .mockReturnValue(userPayload);
            const { statusCode } = yield (0, supertest_1.default)(app).post("/api/register").send(Object.assign(Object.assign({}, userInput), { passwordConfirmation: "does not match" }));
            expect(statusCode).toBe(400);
            expect(createUserServiceMock).not.toHaveBeenCalled();
        }));
    });
    describe("given the email is already in use", () => {
        it("should return a 409 error", () => __awaiter(void 0, void 0, void 0, function* () {
            const createUserServiceMock = jest
                .spyOn(UserService, "createUser")
                // @ts-ignore
                .mockRejectedValueOnce("Oh no this email is already in use :(");
            const { statusCode } = yield (0, supertest_1.default)(app).post("/api/register").send(userInput);
            expect(statusCode).toBe(409);
            expect(createUserServiceMock).toHaveBeenCalled();
        }));
    });
    //login user
    describe("create user session", () => {
        describe("given the email and password are valid", () => {
            it("should return a signed accessToken & refreshToken", () => __awaiter(void 0, void 0, void 0, function* () {
                jest
                    .spyOn(UserService, "validatePassword")
                    // @ts-ignore
                    .mockReturnValue(userPayload);
                jest
                    .spyOn(SessionService, "createSession")
                    // @ts-ignore
                    .mockReturnValue(sessionPayload);
                const req = {
                    get: () => {
                        return "a user agent";
                    },
                    body: {
                        email: "test@example.com",
                        password: "Password123",
                    }
                };
                const send = jest.fn();
                const res = {
                    send,
                };
                // @ts-ignore
                yield (0, session_controller_1.createUserSessionHandler)(req, res);
                expect(send).toHaveBeenCalledWith({
                    accessToken: expect.any(String),
                    refreshToken: expect.any(String),
                });
            }));
        });
    });
});
