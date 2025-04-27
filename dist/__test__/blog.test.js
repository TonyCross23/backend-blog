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
exports.userPayload = exports.blogPayload = void 0;
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const blog_service_1 = require("../services/blog.service");
const jwt_util_1 = require("../utils/jwt.util");
const app = (0, server_1.default)();
const userId = new mongoose_1.default.Types.ObjectId().toString();
exports.blogPayload = {
    user: userId,
    title: "Canon EOS 1500D DSLR Camera with 18-55mm Lens",
    content: "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go.",
    image: "https://i.imgur.com/QlRphfQ.jpg"
};
exports.userPayload = {
    _id: userId,
    email: "jane.doe@example.com",
    name: "Jane Doe",
};
describe("blog", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        yield mongoose_1.default.connect(mongoServer.getUri());
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.disconnect();
        yield mongoose_1.default.connection.close();
    }));
    describe('get blog route', () => {
        describe('given the blog does not exist', () => {
            it("should return a 404", () => __awaiter(void 0, void 0, void 0, function* () {
                const blogId = "blog-1234";
                yield (0, supertest_1.default)(app).get(`/api/blog/${blogId}`).expect(404);
            }));
        });
        describe('given the blog does exist', () => {
            it("should return a 200 status and the blog", () => __awaiter(void 0, void 0, void 0, function* () {
                const blog = yield (0, blog_service_1.createBlog)(exports.blogPayload);
                const { body, statusCode } = yield (0, supertest_1.default)(app).get(`/api/blog/${blog.blogId}`).expect(200);
                expect(statusCode).toBe(200);
                expect(body.blogId).toEqual(blog.blogId);
            }));
        });
    });
    describe('get all blogs route', () => {
        it("should return a 200 status and an array of blogs", () => __awaiter(void 0, void 0, void 0, function* () {
            const { body, statusCode } = yield (0, supertest_1.default)(app).get('/api/blogs').expect(200);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Array);
        }));
    });
    describe('create blog route', () => {
        describe("given the user is not logged in", () => {
            it("should return a 403", () => __awaiter(void 0, void 0, void 0, function* () {
                const { statusCode } = yield (0, supertest_1.default)(app).post('/api/blog').send(exports.blogPayload).expect(403);
                expect(statusCode).toBe(403);
            }));
        });
        describe("given the user is logged in", () => {
            it("should return a 201 status and the created blog", () => __awaiter(void 0, void 0, void 0, function* () {
                const jwt = (0, jwt_util_1.signJwt)(exports.userPayload);
                const { statusCode, body } = yield (0, supertest_1.default)(app).post("/api/blog").set("Authorization", `Bearer ${jwt}`).send(exports.blogPayload).expect(201);
                expect(statusCode).toBe(200);
                expect(body).toEqual({
                    __v: 0,
                    _id: expect.any(String),
                    createdAt: expect.any(String),
                    content: "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go.",
                    image: "https://i.imgur.com/QlRphfQ.jpg",
                    blogId: expect.any(String),
                    title: "Canon EOS 1500D DSLR Camera with 18-55mm Lens",
                    updatedAt: expect.any(String),
                    user: expect.any(String),
                });
            }));
        });
    });
});
