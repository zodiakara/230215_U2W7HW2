import supertest from "supertest";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { expressServer } from "../server";
import UsersModel from "../api/users/model";

dotenv.config(); // a function that loads all the .env vars - you do that when you cannot use -r dotenv config in json -> it works only on npm run dev not in npm run tests!!!
const client = supertest(expressServer);

const validUser = {
  name: "john",
  surname: "rambo",
  email: "john.rambo@hmail.com",
  password: "12345",
  role: "User",
};

const notValidUser = {
  name: "John",
  surname: "Rambo",
  email: "john@gmail.com",
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL_TEST!);
  const product = new UsersModel(validUser);
  await product.save();
});
// beforeAll is a Jest hook ran before all the tests, usually it is used to connect to the db and to do some initial setup (like inserting some mock data in the db)

afterAll(async () => {
  await UsersModel.deleteMany();
  await mongoose.connection.close();
});

describe("Test APIs", () => {
  it("Should test that POST /users returns a valid _id and 201", async () => {
    const response = await client.post("/users").send(validUser).expect(201);
    expect(response.body._id).toBeDefined();
  });

  it("Should test that GET /users returns a success status and a body", async () => {
    const response = await client.get("/users").expect(200);
    console.log(response.body);
  });

  it("Should test that POST /users with a not valid user returns a 400", async () => {
    await client.post("/users").send(notValidUser).expect(400);
  });
});
