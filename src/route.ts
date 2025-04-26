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

  //blog
  app.post(
    "/api/blog",
    requireUser,
    upload.single("image"),
    validateRequest(createBlogSchema),
    createBlogHandler
  );
  app.get("/api/blogs", getAllBlogsHandler);
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
