import { Express, Request, Response } from "express";
import validateRequest from "./middlewares/validateRequest";
import { createUserSchema } from "./schemas/user.schema";
import { createUserHandler } from "./controllers/user.controller";

const route = (app: Express) => {
  app.get("/healthcheck", (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.post(
    "/api/register",
    validateRequest(createUserSchema),
    createUserHandler
  );
};

export default route;
