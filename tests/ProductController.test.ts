import { assertEquals, assertExists } from "@std/assert";
import mongoose from "mongoose";
import { Request } from "express";
import { connectDB } from "../config/ConnectDB.ts";
import { ProductsController } from "../controllers/ProductsController.ts
import { UserModel } from "../models/User/User.ts";
import { MockResponser } from "../globals/mockResponser.ts";

const productsController = new ProductsController();

const testEmail = "tester@gmail.com"
  Deno.test.beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }
  });

  Deno.test.afterAll(async () => {
    await mongoose.disconnect();
  });

  // CREATE - Positive
      Deno.test("should create a new product", async () => {
      const user = await UserModel.findOne({ email: testEmail });
      
        assertExists(user, "O usuário deveria existir");
      
        const updatePayload = {
          name: "Updated Name Test",
          id: user._id.toString() 
        };
      
        const MockRequest = {
          body: updatePayload,
        } as unknown as Request;
      
  
        assertEquals(result.code, 201);
        assertEquals(result.message, "Usuário criado com sucesso!");
      });



