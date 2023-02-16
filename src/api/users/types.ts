import { Model, Document } from "mongoose";

interface User {
  name: string;
  surname: string;
  email: string;
  password: string;
  role: "User" | "Admin";
}

export interface UserDocument extends User, Document {}

export interface UserModel extends Model<UserDocument> {
  checkCredentials(
    email: string,
    password: string
  ): Promise<UserDocument | null>;
}
