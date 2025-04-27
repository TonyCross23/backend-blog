import jwt from "jsonwebtoken";
import config from "../config/default";

const privateKey = config.privateKey as string;
const publicKey = config.publicKey as string;

export const signJwt = (
  object: Object,
  options?: jwt.SignOptions | undefined
) => {
  return jwt.sign(object, privateKey, {
    ...options,
    algorithm: "RS256",
  });
};

export const verifyJWT = (token: string) => {
  try {
    const decoded = jwt.verify(token, publicKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    return {
      valid: false,
      expired: e.message === "session expired",
      decoded: null,
    };
  }
};
