import { assertEquals, assertExists } from "@std/assert";
import mongoose from "mongoose";
import { Request } from "express";
import { connectDB } from "../config/ConnectDB.ts";
import { usersController } from "../controllers/UserController.ts";
import { UserModel } from "../models/User/User.ts";
import { userRole } from "../models/User/IUser.ts";
import "../models/Product/Product.ts";
import { MockResponser } from "../globals/mockResponser.ts";

const UsersController = new usersController();

const testEmail = "test_email@gmail.com";
const testEmailAdmin = "admin_getall@test.com";


Deno.test.beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }
});

Deno.test.afterAll(async () => {
  await mongoose.disconnect();
});

// CREATE - Positive
Deno.test("should create a new user", async () => {
  const payload = {
    name: "Usuario Teste Deno",
    password: "senhaSegura123",
    email: testEmail,
    role: "customer",
  };

  const MockRequest = { body: payload } as unknown as Request;

  const result = await UsersController.create(MockRequest, MockResponser);

  assertEquals(result.code, 201);
  assertEquals(result.message, "Usuário criado com sucesso!");
});

// Create - negative
Deno.test("should not create a new user with same email", async () => {
  const payload = {
    name: "Usuario Teste Deno",
    password: "senhaSegura123",
    email: testEmail,
    role: "customer",
  };

  const MockRequest = { body: payload } as unknown as Request;

  const result = await UsersController.create(MockRequest, MockResponser);

  assertEquals(result.code, 400);
  assertEquals(result.message, "Erro ao criar usuário");
});

// Create - negative - validação
Deno.test("should not create a new user with less 6 caracteres password", async () => {
  const payload = {
    name: "Usuario Teste Deno",
    password: "-6car",
    email: testEmail,
    role: "customer",
  };

  const MockRequest = { body: payload } as unknown as Request;

  const result = await UsersController.create(MockRequest, MockResponser);

  assertEquals(result.code, 400);
  assertEquals(result.message, "Erro de validação");
});

// GETALL - Positive
Deno.test("should get all users", async () => {
  const admin = await UserModel.create({
    name: "Admin Get All Test",
    email: testEmailAdmin,
    password: "senhaSegura123",
    role: userRole.ADMIN,
  });

  try {
    const MockRequest = {
      user: {
        _id: admin._id.toString(),
        role: userRole.ADMIN,
      },
    } as unknown as Request;

    const result = await UsersController.getAll(MockRequest, MockResponser);

    assertEquals(result.code, 200);
    assertEquals(result.message, "Usuarios encontrados:");
    assertExists(result.data);
    assertExists(result.data.users);
  } finally {
    await UserModel.deleteOne({ email: testEmailAdmin });
  }
});

// GETALL - Negative - autorização
Deno.test("should not get all users - authorization failure", async () => {
  const user = await UserModel.findOne({ email: testEmail });
  assertExists(user, "O usuário deveria existir");

  const MockRequest = {
    user: {
      _id: user._id.toString(),
      role: "customer",
    },
  } as unknown as Request;

  const result = await UsersController.getAll(MockRequest, MockResponser);

  assertEquals(result.code, 400);
  assertEquals(result.message, "Não foi possível buscar todos os usuários");
});

// Update - positive
Deno.test("should update an existing user successfully", async () => {
  const user = await UserModel.findOne({ email: testEmail });

  assertExists(user, "O usuário deveria existir");

  const updatePayload = {
    name: "Updated Name Test",
  };

  const MockRequest = {
    params: { id: user._id.toString() },
    body: updatePayload,

    user: {
      _id: user._id.toString(),
      role: "customer",
    },
  } as unknown as Request;

  const result = await UsersController.updateUser(
    MockRequest,
    MockResponser,
  );

  assertEquals(result.code, 200);
  assertEquals(result.message, "Usuário atualizado com sucesso");
});

// update - negative - validação
Deno.test("should not update an user with min caracteres", async () => {
  const user = await UserModel.findOne({ email: testEmail });

  assertExists(user, "O usuário deveria existir");

  const updatePayload = {
    name: "U",
  };

  const MockRequest = {
    params: { id: user._id.toString() },
    body: updatePayload,

    user: {
      _id: user._id.toString(),
      role: "customer",
    },
  } as unknown as Request;

  const result = await UsersController.updateUser(
    MockRequest,
    MockResponser,
  );

  assertEquals(result.code, 400);
  assertEquals(result.message, "Erro de validação!");
});

// update - negative - autorização
Deno.test("should not update with a different person id", async () => {
  const user = await UserModel.findOne({ email: testEmail });

  assertExists(user, "O usuário deveria existir");

  const updatePayload = {
    name: "Test Name",
  };

  const MockRequest = {
    params: { id: user._id.toString() },
    body: updatePayload,

    user: {
      _id: "iderro",
      role: "customer",
    },
  } as unknown as Request;

  const result = await UsersController.updateUser(
    MockRequest,
    MockResponser,
  );

  assertEquals(result.code, 400);
  assertEquals(result.message, "Não foi possível fazer alterações");
});

// delete - negative - autorização
Deno.test("should not delete a user with a different user id", async () => {
  const user = await UserModel.findOne({ email: testEmail });

  assertExists(user, "O usuário deveria existir");

  const MockRequest = {
    params: { id: user._id.toString() },
    user: {
      _id: "id_erro",
      role: user.role,
    },
  } as unknown as Request;

  const result = await UsersController.deleteUser(
    MockRequest,
    MockResponser,
  );

  assertEquals(result.code, 400);
  assertEquals(result.message, "Não foi possível concluir a operação.");
});

// delete - positive
Deno.test("should delete a user", async () => {
  const user = await UserModel.findOne({ email: testEmail });

  assertExists(user, "O usuário deveria existir");

  const MockRequest = {
    params: { id: user._id.toString() },
    user: {
      _id: user._id.toString(),
      role: user.role,
    },
  } as unknown as Request;

  const result = await UsersController.deleteUser(
    MockRequest,
    MockResponser,
  );

  assertEquals(result.code, 200);
  assertEquals(
    result.message,
    `Usuário do id: ${user._id.toString()} foi deletado com sucesso.`,
  );
});
