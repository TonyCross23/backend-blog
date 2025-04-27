import { Request, Response } from "express";
import { CreateUserInput } from "../schemas/user.schema";
import log from "../logger/logger";
import { createUser } from "../services/user.service";

export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
): Promise<void> => {
  try {
    const user = await createUser(req.body);
    res.send(user);
  } catch (e: any) {
    log.error(e);
    res.status(409).json(e.message);
  }
};
