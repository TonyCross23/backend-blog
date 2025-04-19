import { Request, Response } from "express";
import { validatePassword } from "../services/user.service";
import { createSession, findSession } from "../services/session.service";
import { signJwt } from "../utils/jwt.utils";
import config from "config";

export async function createUserSessionHandler(req: Request, res: Response) {
  //validation the user's password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(409).send("Invalid email or password");
  }

  //create a session
  const session = await createSession(
    user._id as string,
    req.get("user-agent") || ""
  );

  //create an access token
  const accessToken = signJwt(
    {
      ...user,
      session: session._id,
    },
    { expiresIn: config.get("accessTokenTtl") } //15minutes
  );

  // create a refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("refreshTokenTtl") } //1year
  );

  //return accessToken & refreshToken
  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;

  const sessions = await findSession({ user: userId, valid: false });
  return res.send(sessions);
}
