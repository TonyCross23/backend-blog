import { Express, Request, Response } from "express";
import validateResource from "../middlewares/validationResource";
import { createUserSchema } from "../schema/user.schema";
import { createUserHandler } from "../controllers/user.controller";

function routers(app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.post(
    "/api/register",
    validateResource(createUserSchema),
    createUserHandler
  );
}

export default routers;
