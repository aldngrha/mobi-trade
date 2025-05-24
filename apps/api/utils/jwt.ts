import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const signJWT = (
  payload: object,
  expiresIn: SignOptions["expiresIn"] = "7d",
) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyJWT = <T>(token: string): T | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch {
    return null;
  }
};
