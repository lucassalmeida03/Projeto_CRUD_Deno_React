import { assertEquals, assertExists } from "@std/assert";
import mongoose from "mongoose";
import { Request } from "express";
import bcrypt from "bcrypt";
import { connectDB } from "../config/ConnectDB.ts";
import { sessionsController } from "../controllers/SessionsController.ts";
import { UserModel } from "../models/User/User.ts";
import { userRole } from "../models/User/IUser.ts";
import { MockResponser } from "../globals/mockResponser.ts";

const sessionController = new sessionsController();
const testEmailSession = "session_login@test.com";

Deno.test.beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }

  await UserModel.deleteOne({ email: testEmailSession });
  await UserModel.create({
    name: "Session User",
    email: testEmailSession,
    password: await bcrypt.hash("senhaSegura123", 8),
    role: userRole.CUSTOMER,
  });
});

Deno.test.afterAll(async () => {
  await UserModel.deleteOne({ email: testEmailSession });
  await mongoose.disconnect();
});

Deno.test("should create a new session", async () => {
  const MockRequest = {
    body: {
      email: testEmailSession,
      password: "senhaSegura123",
    },
  } as unknown as Request;

  const result = await sessionController.createSession(MockRequest, MockResponser);

  assertEquals(result.code, 200);
  assertEquals(result.message, "Sessão criada com sucesso!");
  assertExists(result.data);
  assertExists(result.data.token);
  assertExists(result.data.user);
});

Deno.test("should not create a session - invalid email format", async () => {
  const MockRequest = {
    body: {
      email: "email-invalido",
      password: "senhaSegura123",
    },
  } as unknown as Request;

  const result = await sessionController.createSession(MockRequest, MockResponser);

  assertEquals(result.code, 400);
  assertEquals(result.message, "Erro de validação!");
  assertExists(result.errors);
});

Deno.test("should not create a session - user not found", async () => {
  const MockRequest = {
    body: {
      email: "usuario_inexistente@test.com",
      password: "senhaSegura123",
    },
  } as unknown as Request;

  const result = await sessionController.createSession(MockRequest, MockResponser);

  assertEquals(result.code, 400);
  assertEquals(result.message, "Algo deu errado!");
  assertExists(result.errors);
  assertExists(result.errors.error);
});

Deno.test("should not create a session - wrong password", async () => {
  const MockRequest = {
    body: {
      email: testEmailSession,
      password: "senhaErrada123",
    },
  } as unknown as Request;

  const result = await sessionController.createSession(MockRequest, MockResponser);

  assertEquals(result.code, 400);
  assertEquals(result.message, "Algo deu errado!");
  assertExists(result.errors);
  assertExists(result.errors.error);
});
