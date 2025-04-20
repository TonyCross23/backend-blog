import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel, { SessionDocument } from "../models/session.model";
import config from "config";
import { signJwt, verifyJWT } from "../utils/jwt.util";
import { get } from "lodash";
import { findUser } from "./user.service";

export const createSession = async (userId: string, userAgent: string) => {
  const session = await SessionModel.create({ user: userId, userAgent });

  return session.toJSON();
};

export const findSession = async (query: FilterQuery<SessionDocument>) => {
  return SessionModel.find(query).lean();
};

export const updateSession = async (query: FilterQuery<SessionDocument>, update: UpdateQuery<SessionDocument>) => {
  return SessionModel.updateOne(query, update);
};

export const reIssueAccessToken = async ({ refreshToken }: { refreshToken: string }) => {
  const { decoded } = verifyJWT(refreshToken);
  
  if (!decoded || get(decoded, "session")) {
    return false;
  }

  const session = await SessionModel.findById(get(decoded, "session"));

  if(!session || !session.valid) {
    return false;
  }

  const user = await findUser({ _id: session.user });

  if(!user) {
    return false;
  }

   // create an access token
    const accessToken = signJwt(
      { ...user, session: session._id },
      { expiresIn: config.get("accessTokenTtl") } // 15 minutes,
    );
  
  return accessToken;
}
