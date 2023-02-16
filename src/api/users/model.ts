import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserDocument, UserModel } from "./types";

const { Schema, model } = mongoose;

const UsersSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Admin", "User"], default: "User" },
  },
  {
    timestamps: true,
  }
);

UsersSchema.pre("save", async function (next) {
  // BEFORE saving the user in db, executes this custom function automagically
  // Here I am not using arrow functions as I normally do because of "this" keyword
  // (it would be undefined in case of arrow function, it is the current user in the case of a normal function)

  const currentUser = this;

  if (currentUser.isModified("password")) {
    // only if the user is modifying the pw (or if the user is being created) I would like to spend some precious CPU cycles on hashing the pw
    const plainPW = currentUser.password;

    const hash = await bcrypt.hash(plainPW, 11);
    currentUser.password = hash;
  }
  // When we are done with this function --> next
  next();
});

UsersSchema.methods.toJSON = function () {
  // This .toJSON method is used EVERY TIME Express does a res.send(user/s)
  // This does mean that we could override the default behavior of this method to remove the passwords (and other unnecessary things as well) and then return the users

  const userDocument = this;
  const user = userDocument.toObject();

  delete user.password;
  delete user.createdAt;
  delete user.updatedAt;
  delete user.__v;
  return user;
};

UsersSchema.static("checkCredentials", async function (email, password) {
  // My own custom method attached to the UsersModel

  // Given email and plain text password, this method has to check in the db if the user exists (by email)
  // Then it should compare the given password with the hashed one coming from the db
  // Then it should return an useful response

  // 1. Find by email
  const user = await this.findOne({ email }); //"this" here represents the User Model

  if (user) {
    // 2. If the user is found --> compare plain password with the hashed one
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // 3. If passwords they match --> return user

      return user;
    } else {
      // 4. If they don't --> return null
      return null;
    }
  } else {
    // 5. In case of user not found --> return null
    return null;
  }
});

// USAGE: const user = await UserModel.checkCredentials("rambo@gmail.com", "1234")
// if(user){// credentials are good}
// else { // credentials not good}

export default model<UserDocument, UserModel>("user", UsersSchema);
