"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blog_controller_1 = require("./controllers/blog.controller");
const validateRequest_1 = __importDefault(require("./middlewares/validateRequest"));
const user_schema_1 = require("./schemas/user.schema");
const user_controller_1 = require("./controllers/user.controller");
const session_controller_1 = require("./controllers/session.controller");
const session_schema_1 = require("./schemas/session.schema");
const requireUser_1 = __importDefault(require("./middlewares/requireUser"));
const blog_schema_1 = require("./schemas/blog.schema");
const cloudinaryStorage_1 = __importDefault(require("./utils/cloudinaryStorage"));
const route = (app) => {
    /**
     * @openapi
     * /healthcheck:
     *  get:
     *     tags:
     *     - Healthcheck
     *     description: Responds if the app is up and running
     *     responses:
     *       200:
     *         description: App is up and running
     */
    app.get("/healthcheck", (req, res) => {
        res.sendStatus(200);
    });
    /**
     * @openapi
     * '/api/users':
     *  post:
     *     tags:
     *     - User
     *     summary: Register a user
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *              $ref: '#/components/schemas/CreateUserInput'
     *     responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/CreateUserResponse'
     *      409:
     *        description: Conflict
     *      400:
     *        description: Bad request
     */
    app.post("/api/register", (0, validateRequest_1.default)(user_schema_1.createUserSchema), user_controller_1.createUserHandler);
    /**
     * @openapi
     * '/api/login':
     *  get:
     *    tags:
     *    - Session
     *    summary: Get all sessions
     *    responses:
     *      200:
     *        description: Get all sessions for current user
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/GetSessionResponse'
     *      403:
     *        description: Forbidden
     *  post:
     *    tags:
     *    - Session
     *    summary: Create a session
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            $ref: '#/components/schemas/CreateSessionInput'
     *    responses:
     *      200:
     *        description: Session created
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/CreateSessionResponse'
     *      401:
     *        description: Unauthorized
     *  delete:
     *    tags:
     *    - Session
     *    summary: Delete a session
     *    responses:
     *      200:
     *        description: Session deleted
     *      403:
     *        description: Forbidden
     */
    app.post("/api/login", (0, validateRequest_1.default)(session_schema_1.createSessionSchema), session_controller_1.createUserSessionHandler);
    app.get("/api/user/sessions", requireUser_1.default, session_controller_1.getUserSessionHandler);
    app.delete("/api/sessions", requireUser_1.default, session_controller_1.deleteSessionHandler);
    /**
     * @openapi
     * '/api/blog':
     *  post:
     *   tags:
     *   - Blog
     *   summary: Create new blog
     *   requestBody:
     *     required: true
     *     content:
     *       application/json:
     *         schema:
     *           $ref: '#/components/schemas/Blog'
     *   responses:
     *     200:
     *       description: Blog created
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/blogResponse'
     *           examples:
     *             "user": "642a0de05f16e6dad68efdad"
     *             "title": "Canon EOS 1500D DSLR Camera with 18-55mm Lens"
     *             "description": "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go."
     *             "price": 879.99
     *             "image": "https://i.imgur.com/QlRphfQ.jpg"
     *             "_id": "642a1cfcc1bec76d8a2e7ac2"
     *             "productId": "product_xxqm8z3eho"
     *             "createdAt": "2023-04-03T00:25:32.189Z"
     *             "updatedAt": "2023-04-03T00:25:32.189Z"
     *             "__v": 0
     */
    app.post("/api/blog", requireUser_1.default, cloudinaryStorage_1.default.single("image"), (0, validateRequest_1.default)(blog_schema_1.createBlogSchema), blog_controller_1.createBlogHandler);
    /**
     * @openapi
     * /api/blogs:
     *   get:
     *     tags:
     *       - Blog
     *     summary: Get all blogs
     *     responses:
     *       200:
     *         description: List of blogs
     *         content:
     *           application/json:
     *             schema:
     *               items:
     *                 $ref: '#/components/schemas/Blog'
     */
    app.get("/api/blogs", blog_controller_1.getAllBlogsHandler);
    /**
     * @openapi
     * '/api/blog/{blogId}':
     *  get:
     *   tags:
     *   - Blog
     *   summary: Get blog by id
     *   parameters:
     *     - name: blogId
     *       in: path
     *       description: The id of the blog
     *       required: true
     *   responses:
     *     200:
     *       description: Success
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/blogResponse'
     *     404:
     *       description: Blog not found
     *  put:
     *   tags:
     *   - Blog
     *   summary: Update blog by id
     *   parameters:
     *     - name: blogId
     *       in: path
     *       description: The id of the blog
     *       required: true
     *   requestBody:
     *     required: true
     *     content:
     *       application/json:
     *         schema:
     *           $ref: '#/components/schemas/Blog'
     *   responses:
     *     200:
     *       description: Blog updated
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/blogResponse'
     *     404:
     *       description: Blog not found
     *     403:
     *       description: Forbidden
     *  delete:
     *   tags:
     *   - Blog
     *   summary: Delete blog by id
     *   parameters:
     *     - name: blogId
     *       in: path
     *       description: The id of the blog
     *       required: true
     *   responses:
     *     200:
     *       description: Blog deleted
     *     404:
     *       description: Blog not found
     *     403:
     *       description: Forbidden
     *     400:
     *       description: Bad request
     */
    app.get("/api/blog/:blogId", blog_controller_1.findBlogByIdHandler);
    app.put("/api/blog/:blogId", cloudinaryStorage_1.default.single("image"), [requireUser_1.default, (0, validateRequest_1.default)(blog_schema_1.updateBlogSchema)], blog_controller_1.updateBlogHandler);
    app.delete("/api/blog/:blogId", requireUser_1.default, (0, validateRequest_1.default)(blog_schema_1.deleteProductSchema), blog_controller_1.deleteBlogHandler);
};
exports.default = route;
