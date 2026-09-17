import { assertEquals } from "@std/assert";
import mongoose from "mongoose";
import { Request } from "express";
import { connectDB } from "../config/ConnectDB.ts";
import { usersController } from "../controllers/UserController.ts";
import { UserModel } from "../models/User/User.ts";
import { MockResponser } from "../globals/mockResponser.ts";
import { throwlhos } from "../globals/Throwlhos.ts";

const UsersController = new usersController();

const testEmail = "test_email@gmail.com"

  Deno.test.beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }
  });

  Deno.test.afterAll(async () => {
    await UserModel.deleteOne({ email: testEmail });
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

    })

    // Update - positive
   Deno.test("should update an existing user successfully", async () => {
  // Busca o usuário existente no banco
  const user = await UserModel.findOne({ email: testEmail });

if(!user) {
    throw throwlhos.err_notFound("Usuário inexistente.")
  }

  const updatePayload = {
    name: "Updated Name Test",
    
  };

  const MockRequest = {
    params: { id: user._id.toString()},
    body: updatePayload,
  } as unknown as Request;

  const result = await UsersController.updateUser(MockRequest, MockResponser);

  assertEquals(result.code, 200);
  assertEquals(result.data.user.name, "Updated Name Test");

});



