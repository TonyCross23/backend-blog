import { Request, Response } from "express";
import { validatePassword } from "../services/user.service";
import { createSession } from "../services/session.service";

export async function createUserSession(req: Request, res: Response) {
  //validation the user's password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(409).send("Invalid email or password");
  }

  //create a session
  const session = createSession(user._id as string, req.get("user-agent") || "");
}
