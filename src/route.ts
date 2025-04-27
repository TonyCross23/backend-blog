import {
  createBlogHandler,
  deleteBlogHandler,
  findBlogByIdHandler,
  getAllBlogsHandler,
  updateBlogHandler,
} from "./controllers/blog.controller";
import { Express, Request, Response } from "express";
import validateRequest from "./middlewares/validateRequest";
import { createUserSchema } from "./schemas/user.schema";
import { createUserHandler } from "./controllers/user.controller";
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionHandler,
} from "./controllers/session.controller";
import { createSessionSchema } from "./schemas/session.schema";
import requireUser from "./middlewares/requireUser";
import {
  createBlogSchema,
  deleteProductSchema,
  updateBlogSchema,
} from "./schemas/blog.schema";
import upload from "./utils/cloudinaryStorage";

const route = (app: Express) => {
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
  app.get("/healthcheck", (req: Request, res: Response) => {
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
  app.post(
    "/api/register",
    validateRequest(createUserSchema),
    createUserHandler
  );

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
  app.post(
    "/api/login",
    validateRequest(createSessionSchema),
    createUserSessionHandler
  );

  app.get("/api/user/sessions", requireUser, getUserSessionHandler);
  app.delete("/api/sessions", requireUser, deleteSessionHandler);

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
  app.post(
    "/api/blog",
    requireUser,
    upload.single("image"),
    validateRequest(createBlogSchema),
    createBlogHandler
  );

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
  app.get("/api/blogs", getAllBlogsHandler);

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
  app.get("/api/blog/:blogId", findBlogByIdHandler);
  app.put(
    "/api/blog/:blogId",
    upload.single("image"),
    [requireUser, validateRequest(updateBlogSchema)],
    updateBlogHandler
  );
  app.delete(
    "/api/blog/:blogId",
    requireUser,
    validateRequest(deleteProductSchema),
    deleteBlogHandler
  );
};

export default route;
