"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductSchema = exports.updateBlogSchema = exports.createBlogSchema = void 0;
const zod_1 = require("zod");
/**
 * @openapi
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       required:
 *        - title
 *        - content
 *        - image
 *       properties:
 *        title:
 *         type: string
 *         default: My first blog
 *        content:
 *         type: string
 *         default: This is my first blog content
 *        image:
 *         type: string
 *         default: https://example.com/image.jpg
 *     blogResponse:
 *         user:
 *          type: string
 *         _id:
 *          type: string
 *         title:
 *          type: string
 *         content:
 *          type: string
 *         image:
 *          type: string
 *         blogId:
 *          type: string
 *         createdAt:
 *          type: string
 *         updatedAt:
 *          type: string
 *         __v:
 *          type: number
 */
const payload = {
    body: (0, zod_1.object)({
        title: (0, zod_1.string)({
            required_error: "Title is required",
        }),
        content: (0, zod_1.string)({
            required_error: "Content is required",
        }),
    }),
};
const params = (0, zod_1.object)({
    params: (0, zod_1.object)({
        blogId: (0, zod_1.string)({
            required_error: "Blog id is required",
        }),
    }),
});
exports.createBlogSchema = (0, zod_1.object)(Object.assign({}, payload));
exports.updateBlogSchema = (0, zod_1.object)({
    body: payload.body,
    params: params.shape.params,
});
exports.deleteProductSchema = (0, zod_1.object)(Object.assign({}, params.shape));
