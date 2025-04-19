import { Express, Request, Response } from "express";
import validateResource from "../middlewares/validationResource";
import { createUserSchema } from "../schema/user.schema";
import { createUserHandler } from "../controllers/user.controller";
import {
  createUserSessionHandler,
  getUserSessionsHandler,
} from "../controllers/session.controller";
import { createSessionSchema } from "../schema/session.schema";
import requireUser from "../middlewares/requireUser";

function routers(app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.post(
    "/api/register",
    validateResource(createUserSchema),
    createUserHandler
  );
  app.post(
    "/api/login",
    validateResource(createSessionSchema),
    createUserSessionHandler
  );

  app.get("/api/user/sessions", requireUser, getUserSessionsHandler);
}

export default routers;
