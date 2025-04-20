import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { verifyJWT } from "../utils/jwt.util";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  if (!accessToken) {
    return next();
  }

  const { decoded, expired } = verifyJWT(accessToken);
  console.log("decoded", decoded);

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  return next();
};

export default deserializeUser;
