// by default jest doesn't work with the new import sybtax
// we should add NODEOPTIONS=--experimental-vm-modules to the test script in package.json to enable the usega of import syntax
// on windows you cannot use NODE_OPTIONS (and all env vars) -> you need to add cross-env package

import supertest from "supertest";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { expressServer } from "../server";
import ProductsModel from "../api/products/model";

dotenv.config(); // a function that loads all the .env vars - you do that when you cannot use -r dotenv config in json -> it works only on npm run dev not in npm run tests!!!
const client = supertest(expressServer);

/* describe("Test APIs", () => {
  it("Should test that GET /test endpoint returns 200 and a body containing a message", async () => {
    const response = await client.get("/test")
    expect(response.status).toBe(200)
    expect(response.body.message).toEqual("Test successfull")
  })
})
 */

const validProduct = {
  name: "A valid product",
  description: "balllablalblabl",
  price: 100,
};

const notValidProduct = {
  name: "A not valid product",
  price: 100,
};

const fakeId = "123456123456123456123456";

// beforeAll is a Jest hook ran before all the tests, usually it is used to connect to the db and to do some initial setup
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL_TEST!);
  const product = new ProductsModel({
    name: "test",
    description: "blalblabla",
    price: 20,
  });
  await product.save();
});

// afterAll hook could be used to clean up the situation (close the connection to mongo gently and clean up the db)
afterAll(async () => {
  await ProductsModel.deleteMany();
  await mongoose.connection.close();
});

describe("test API's", () => {
  it("Should test that the env vars are set correctly", () => {
    expect(process.env.MONGO_URL_TEST!).toBeDefined();
  });

  it("Should test that GET /products returns a success status and a body", async () => {
    const response = await client.get("/products").expect(200);
    console.log(response.body);
  });

  it("Should test that POST /products returns a valid _id and 201", async () => {
    const response = await client
      .post("/products")
      .send(validProduct)
      .expect(201);
    expect(response.body._id).toBeDefined();
  });

  it("Should test that POST /products with a not valid product returns a 400", async () => {
    await client.post("/products").send(notValidProduct).expect(400);
  });

  it("Should test that GET /products/:id should return 404 when fetched with the wrong ID.", async () => {
    await client.get(`/products/${fakeId}`).expect(404);
  });
  it("Should test that GET /products/:id returns a correct product with a valid id", async () => {
    const response = await client.post("/products").send(validProduct);
    const product = await client
      .get(`/products/${response.body._id}`)
      .expect(200);
    expect(product.body).toBeDefined();
    expect(response.body._id).toBe(product.body._id);
  });
});
