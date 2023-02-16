import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";

export interface TokenPayload {
  _id: ObjectId;
  role: "User" | "Admin";
}

export const createAccessToken = (payload: TokenPayload): Promise<String> =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token as string);
      }
    )
  );

export const verifyAccessToken = (token: string): Promise<TokenPayload> =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET!, (err, originalPayload) => {
      if (err) reject(err);
      else resolve(originalPayload as TokenPayload);
    })
  );
