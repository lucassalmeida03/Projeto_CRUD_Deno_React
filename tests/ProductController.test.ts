import { assertEquals, assertExists } from "@std/assert";
import mongoose from "mongoose";
import { Request } from "express";
import { connectDB } from "../config/ConnectDB.ts";
import { ProductsController } from "../controllers/ProductsController.ts";
import { UserModel } from "../models/User/User.ts";
import { ProductModel } from "../models/Product/Product.ts"
import { MockResponser } from "../globals/mockResponser.ts";


const productsController = new ProductsController();
const testEmail = "tester@gmail.com";
const testEmailCustomer = "netinho@gmail.com"

Deno.test.beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }
});

Deno.test.afterAll(async () => {
  await ProductModel.deleteOne({title: "Test Product"})
  await mongoose.disconnect();
});

// CREATE - Positive
Deno.test("should create a new product", async () => {
  const user = await UserModel.findOne({ email: testEmail });
  assertExists(user, "Usuário deveria existir.");

  const payload = {
    title: "Test Product",
    price: 10,
    stock: 5,
    description: "product test description.",
    user: user._id,
  };

  const MockRequest = {
    body: payload,
    user: {
      _id: user._id.toString(),
      role: user.role,
    },
  } as unknown as Request;

  const result = await productsController.create(MockRequest, MockResponser);

  assertEquals(result.code, 201);
  assertEquals(result.message, "Produto cadastrado com sucesso!");
});

// CREATE - Negative - validação

Deno.test("should not create a new product - validation failure", async () => {
  const user = await UserModel.findOne({ email: testEmail });
  assertExists(user, "Usuário deveria existir.");

  const payload = {
    title: "T",
    price: 10,
    stock: 5,
    description: "product test description.",
    user: user._id,
  };

  const MockRequest = {
    body: payload,
    user: {
      _id: user._id.toString(),
      role: user.role,
    },
  } as unknown as Request;

  const result = await productsController.create(MockRequest, MockResponser);

  assertEquals(result.code, 400);
  assertEquals(result.message, "Erro de validação!");
});

// CREATE - Negative - autorização

Deno.test("should not create a new product - authorization failure", async () => {
  const user = await UserModel.findOne({ email: testEmailCustomer });
  assertExists(user, "Usuário deveria existir.");

  const payload = {
    title: "Test Product",
    price: 10,
    stock: 5,
    description: "product test description.",
    user: user._id,
  };

  const MockRequest = {
    body: payload,
    user: {
      _id: user._id.toString(),
      role: user.role,
    },
  } as unknown as Request;

  const result = await productsController.create(MockRequest, MockResponser);

  assertEquals(result.code, 400);
  assertEquals(result.message, "Erro ao criar produto.");
});


/// UPDATE - Positive

Deno.test("should update a product", async () => {
  const user = await UserModel.findOne({ email: testEmail });
  const product = await ProductModel.findOne({ title: "Test Product"})
  assertExists(user, "Usuário deveria existir.");
  assertExists(product, "Produto deveria existir.");

  const payload = {
    description: "product test description updated.",
  };

  const MockRequest = {
    body: payload,
    params: { id: product._id.toString() },
    user: {
      _id: user._id.toString(),
      role: user.role,
    },
  } as unknown as Request;

  const result = await productsController.update(MockRequest, MockResponser);

  assertEquals(result.code, 200);
  assertEquals(result.message, "Produto atualizado com sucesso!");
});

/// UPDATE - Negative - validation

Deno.test("should not update a product - validation failure", async () => {
  const user = await UserModel.findOne({ email: testEmail });
  const product = await ProductModel.findOne({ title: "Test Product"})
  assertExists(user, "Usuário deveria existir.");
  assertExists(product, "Produto deveria existir.");

  const payload = {
    price: -1,
  };

  const MockRequest = {
    body: payload,
    params: { id: product._id.toString() },
    user: {
      _id: user._id.toString(),
      role: user.role,
    },
  } as unknown as Request;

  const result = await productsController.update(MockRequest, MockResponser);

  assertEquals(result.code, 400);
  assertEquals(result.message, "Erro de validação!");
});

/// UPDATE - Negative - authorization

Deno.test("should not update a product - authorization failure", async () => {
  const user = await UserModel.findOne({ email: testEmailCustomer });
  const product = await ProductModel.findOne({ title: "Test Product"})
  assertExists(user, "Usuário deveria existir.");
  assertExists(product, "Produto deveria existir.");

  const payload = {
    price: 20,
  };

  const MockRequest = {
    body: payload,
    params: { id: product._id.toString() },
    user: {
      _id: user._id.toString(),
      role: user.role,
    },
  } as unknown as Request;

  const result = await productsController.update(MockRequest, MockResponser);

  assertEquals(result.code, 400);
  assertEquals(result.message, "Erro ao atualizar produto.");
});

