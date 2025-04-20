import { Request, Response } from "express";
import { validatePassword } from "../services/user.service";
import { createSession, findSession, updateSession } from "../services/session.service";
import { signJwt } from "../utils/jwt.util";
import config from "config";

export const createUserSessionHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Validate the user's password
  const user = await validatePassword(req.body);

  if (!user) {
    res.status(409).json("Invalid email or password");
    return;
  }

  // create a session
  const session = await createSession(
    user._id as string,
    req.get("user-agent") || ""
  );

  // create an access token
  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("accessTokenTtl") } // 15 minutes,
  );

  // create a refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("refreshTokenTtl") }
  );

  //access & refresh tokens
  res.send({ accessToken, refreshToken });
};

export const getUserSessionHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = res.locals.user._id;

  const sessions = await findSession({ user: userId, valid: true });

  res.send(sessions);
};

export const deleteSessionHandler = async (req: Request, res: Response): Promise<void> => { 
  const sessionId = res.locals.user.session;
   await updateSession({_id: sessionId}, { valid: false });
  res.send({ accessToken: null, refreshToken: null });
}
