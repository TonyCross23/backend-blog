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
exports.deleteBlogHandler = exports.updateBlogHandler = exports.findBlogByIdHandler = exports.getAllBlogsHandler = exports.createBlogHandler = void 0;
const blog_service_1 = require("./../services/blog.service");
const blog_service_2 = require("../services/blog.service");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const createBlogHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.user._id;
    const { title, content } = req.body;
    // Validate image
    if (!req.file) {
        res.status(400).json({ error: "Image upload failed or not provided" });
        return;
    }
    const newPost = {
        title,
        content,
        image: req.file.path, // Cloudinary URL
        user: userId,
    };
    const blog = yield (0, blog_service_2.createBlog)(newPost);
    console.log("Blog created:", blog);
    res.status(200).send(blog);
});
exports.createBlogHandler = createBlogHandler;
const getAllBlogsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield (0, blog_service_1.getAllBlogs)();
    res.status(200).send(blogs);
});
exports.getAllBlogsHandler = getAllBlogsHandler;
const findBlogByIdHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.blogId;
    const blog = yield (0, blog_service_1.findBlogById)({ blogId });
    if (!blog) {
        res.status(404).send({ error: "Blog not found" });
    }
    res.status(200).send(blog);
});
exports.findBlogByIdHandler = findBlogByIdHandler;
const updateBlogHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.blogId;
    const userId = res.locals.user._id;
    const { title, content } = req.body;
    const blog = yield (0, blog_service_1.findBlogById)({ blogId });
    if (!blog) {
        res.status(404).send({ error: "Blog not found" });
        return;
    }
    // Delete old image from Cloudinary if exists
    if (req.file && blog.image) {
        try {
            // Extract public_id from image URL
            const publicId = blog.image
                .split("/")
                .slice(-1)[0]
                .split(".")[0]; // Extract `xyz` from `https://res.cloudinary.com/.../xyz.jpg`
            yield cloudinary_1.default.uploader.destroy(publicId);
        }
        catch (err) {
            console.error("Error deleting old image from Cloudinary:", err);
        }
    }
    // Prepare updated fields
    const updatedData = {
        title: title || blog.title,
        content: content || blog.content,
        user: userId,
    };
    if (req.file) {
        updatedData.image = req.file.path; // New Cloudinary URL
    }
    const updatedBlog = yield (0, blog_service_1.findAndUpdateBlog)({ blogId }, updatedData, { new: true });
    res.status(200).send(updatedBlog);
});
exports.updateBlogHandler = updateBlogHandler;
const deleteBlogHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.user._id;
    const blogId = req.params.blogId;
    const blog = yield (0, blog_service_1.findBlogById)({ blogId });
    if (!blog) {
        res.sendStatus(404);
        return;
    }
    if (String(blog.user) !== userId) {
        res.sendStatus(403);
        return;
    }
    // Delete image from Cloudinary
    if (blog.image) {
        try {
            const publicId = blog.image
                .split("/")
                .slice(-1)[0]
                .split(".")[0]; // Extract `abc123` from `https://res.cloudinary.com/.../abc123.jpg`
            yield cloudinary_1.default.uploader.destroy(publicId);
        }
        catch (err) {
            console.error("Error deleting image from Cloudinary:", err);
        }
    }
    yield (0, blog_service_1.deleteBlog)({ blogId });
    res.sendStatus(200);
});
exports.deleteBlogHandler = deleteBlogHandler;
