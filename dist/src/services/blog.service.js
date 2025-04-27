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
exports.deleteBlog = exports.findAndUpdateBlog = exports.findBlogById = exports.getAllBlogs = exports.createBlog = void 0;
const blog_model_1 = __importDefault(require("../models/blog.model"));
const metrics_1 = require("../metrics");
const createBlog = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const metricsLabels = {
        operation: "createProduct",
    };
    const timer = metrics_1.databaseResponseTimeHistogram.startTimer();
    try {
        const Blog = yield blog_model_1.default.create(input);
        timer(Object.assign(Object.assign({}, metricsLabels), { success: "true" }));
        return Blog.toJSON();
    }
    catch (e) {
        timer(Object.assign(Object.assign({}, metricsLabels), { success: "false" }));
        throw e;
    }
});
exports.createBlog = createBlog;
const getAllBlogs = () => __awaiter(void 0, void 0, void 0, function* () {
    const metricsLabels = {
        operation: "createProduct",
    };
    const timer = metrics_1.databaseResponseTimeHistogram.startTimer();
    try {
        const blogs = yield blog_model_1.default.find().sort({ createdAt: -1 }).lean();
        timer(Object.assign(Object.assign({}, metricsLabels), { success: "true" }));
        return blogs;
    }
    catch (e) {
        timer(Object.assign(Object.assign({}, metricsLabels), { success: "false" }));
        throw e;
    }
});
exports.getAllBlogs = getAllBlogs;
const findBlogById = (query_1, ...args_1) => __awaiter(void 0, [query_1, ...args_1], void 0, function* (query, options = { lean: true }) {
    const metricsLabels = {
        operation: "createProduct",
    };
    const timer = metrics_1.databaseResponseTimeHistogram.startTimer();
    try {
        const blog = yield blog_model_1.default.findOne(query, {}, options);
        timer(Object.assign(Object.assign({}, metricsLabels), { success: "true" }));
        return blog;
    }
    catch (e) {
        timer(Object.assign(Object.assign({}, metricsLabels), { success: "false" }));
        throw e;
    }
});
exports.findBlogById = findBlogById;
const findAndUpdateBlog = (query, update, options) => __awaiter(void 0, void 0, void 0, function* () {
    const metricsLabels = {
        operation: "createProduct",
    };
    const timer = metrics_1.databaseResponseTimeHistogram.startTimer();
    try {
        const result = yield blog_model_1.default.findOneAndUpdate(query, update, options);
        timer(Object.assign(Object.assign({}, metricsLabels), { success: "true" }));
        return result;
    }
    catch (e) {
        timer(Object.assign(Object.assign({}, metricsLabels), { success: "false" }));
        throw e;
    }
});
exports.findAndUpdateBlog = findAndUpdateBlog;
const deleteBlog = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const metricsLabels = {
        operation: "createProduct",
    };
    const timer = metrics_1.databaseResponseTimeHistogram.startTimer();
    try {
        const result = yield blog_model_1.default.deleteOne(query);
        timer(Object.assign(Object.assign({}, metricsLabels), { success: "true" }));
        return result;
    }
    catch (e) {
        timer(Object.assign(Object.assign({}, metricsLabels), { success: "false" }));
        throw e;
    }
});
exports.deleteBlog = deleteBlog;
