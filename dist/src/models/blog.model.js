"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const blogSession = new mongoose_1.default.Schema({
    blogId: {
        type: String,
        required: true,
        unique: true,
        default: () => `blog_${(0, uuid_1.v4)()}`
    },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
}, {
    timestamps: true
});
const BlogModel = mongoose_1.default.model("Blog", blogSession);
exports.default = BlogModel;
