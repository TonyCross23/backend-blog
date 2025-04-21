import { createBlogHandler } from './controllers/blog.controller';
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
import { createBlogSchema } from './schemas/blog.schema';
import upload from './utils/cloudinaryStorage';

const route = (app: Express) => {
  app.get("/healthcheck", (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.post(
    "/api/register",
    validateRequest(createUserSchema),
    createUserHandler
  );

  app.post(
    "/api/login",
    validateRequest(createSessionSchema),
    createUserSessionHandler
  );

  app.get("/api/user/sessions", requireUser, getUserSessionHandler);
  app.delete("/api/sessions", requireUser, deleteSessionHandler);

  //blog
  app.post("/api/blog", upload.single('image'), [requireUser,validateRequest(createBlogSchema)], createBlogHandler);
};

export default route;
