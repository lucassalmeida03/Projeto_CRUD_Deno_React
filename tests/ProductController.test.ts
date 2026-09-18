import { assertEquals, assertExists } from "@std/assert";
import mongoose from "mongoose";
import { Request } from "express";
import { connectDB } from "../config/ConnectDB.ts";
import { ProductsController } from "../controllers/ProductsController.ts";
import { UserModel } from "../models/User/User.ts";
import { userRole } from "../models/User/IUser.ts";
import { ProductModel } from "../models/Product/Product.ts";
import { MockResponser } from "../globals/mockResponser.ts";

const productsController = new ProductsController();
const testEmailSeller = "product_seller@test.com";
const testEmailCustomer = "product_customer@test.com";

Deno.test.beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }

  await UserModel.deleteMany({
    email: { $in: [testEmailSeller, testEmailCustomer] },
  });

  await UserModel.create([
    {
      name: "Product Seller Test",
      email: testEmailSeller,
      password: "senhaSegura123",
      role: userRole.SELLER,
    },
    {
      name: "Product Customer Test",
      email: testEmailCustomer,
      password: "senhaSegura123",
      role: userRole.CUSTOMER,
    },
  ]);
});

Deno.test.afterAll(async () => {
  await UserModel.deleteMany({
    email: { $in: [testEmailSeller, testEmailCustomer] },
  });
  await mongoose.disconnect();
});

// CREATE - Positive
Deno.test("should create a new product", async () => {
  const user = await UserModel.findOne({ email: testEmailSeller });
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
  const user = await UserModel.findOne({ email: testEmailSeller });
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
      _id: "",
      role: user.role,
    },
  } as unknown as Request;

  const result = await productsController.create(MockRequest, MockResponser);

  assertEquals(result.code, 400);
  assertEquals(result.message, "Erro ao criar produto.");
});

// GETALL - Positive
Deno.test("should get all products", async () => {
  const MockRequest = {} as unknown as Request;
  const result = await productsController.getAll(MockRequest, MockResponser);

  assertEquals(result.code, 200);
  assertEquals(result.message, "Lista de produtos completa:");
});

// GETALL - Negative
Deno.test("should not get all products - database failure", async () => {

    try {
    await mongoose.connection.close()
    const MockRequest = {} as unknown as Request;
    const result = await productsController.getAll(MockRequest, MockResponser);

    assertEquals(result.code, 400);
    assertEquals(result.message, "Erro ao listar produtos.");
     }
     finally {
          await connectDB();
     }
  
});

// GETBYID - Positive
Deno.test("should get a product by id", async () => {
  const product = await ProductModel.findOne({ title: "Test Product" });
  assertExists(product, "Produto deveria existir.");

  const id = product._id.toString()
  const MockRequest = {
    params: { id: id },
  } as unknown as Request;

  const result = await productsController.getById(MockRequest, MockResponser);

  assertEquals(result.code, 200);
  assertEquals(result.message, `Produto com ${id} buscado com sucesso.`);

});

/// GETBYID - Negative - invalid id
Deno.test("should not get a product by id - invalid id", async () => {
  const MockRequest = {
    params: { id: "id_invalido" },
  } as unknown as Request;

  const result = await productsController.getById(MockRequest, MockResponser);

  assertEquals(result.code, 400);
  assertEquals(result.message, "Produto não encontrado.");
});

/// GETBYID - Negative - not found
Deno.test("should not get a product by id - product not found", async () => {
  const MockRequest = {
    params: { id: new mongoose.Types.ObjectId().toString() },
  } as unknown as Request;

  const result = await productsController.getById(MockRequest, MockResponser);

  assertEquals(result.code, 400);
  assertEquals(result.message, "Produto não encontrado.");
});

// GETMYPRODUCTS - Positive
Deno.test("should get my products", async () => {
  const user = await UserModel.findOne({ email: testEmailSeller });
  assertExists(user, "Usuário deveria existir.");

  const MockRequest = {
    user: {
      _id: user._id.toString(),
      role: user.role,
    },
  } as unknown as Request;

  const result = await productsController.getMyProducts(MockRequest, MockResponser);

  assertEquals(result.code, 200);
  assertEquals(result.message, "Busca completa!");

});

// GETMYPRODUCTS - Negative - user id missing
Deno.test("should not get my products - user id missing", async () => {
  const MockRequest = {
    user: {
      role: "seller",
    },
  } as unknown as Request;

  const result = await productsController.getMyProducts(MockRequest, MockResponser);

  assertEquals(result.code, 400);
  assertEquals(result.message, "ID do vendedor não fornecido.");
});

// GETMYPRODUCTS - Negative - database failure
Deno.test("should not get my products - database failure", async () => {
  const user = await UserModel.findOne({ email: testEmailSeller });
  assertExists(user, "Usuário deveria existir.");

  await mongoose.connection.close()

  try {
    const MockRequest = {
      user: {
        _id: user._id.toString(),
        role: user.role,
      },
    } as unknown as Request;

    const result = await productsController.getMyProducts(MockRequest, MockResponser);

    assertEquals(result.code, 400);
    assertEquals(result.message, "Erro ao buscar produtos do vendedor.");
  } finally {
    await connectDB()
  }
});

/// UPDATE - Positive
Deno.test("should update a product", async () => {
  const user = await UserModel.findOne({ email: testEmailSeller });
  const product = await ProductModel.findOne({ title: "Test Product" });
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
  const user = await UserModel.findOne({ email: testEmailSeller });
  const product = await ProductModel.findOne({ title: "Test Product" });
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
  const product = await ProductModel.findOne({ title: "Test Product" });
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

// DELETE - Negative - authorization
Deno.test("should not delete a product - authorization failure", async () => {
  const user = await UserModel.findOne({ email: testEmailCustomer });
  const product = await ProductModel.findOne({ title: "Test Product" });

  assertExists(user, "Usuário deveria existir.");
  assertExists(product, "Produto deveria existir.");

  const MockRequest = {
    params: { id: product._id.toString() },
    user: {
      _id: "id_diferente",
      role: user.role,
    },
  } as unknown as Request;

  const result = await productsController.delete(MockRequest, MockResponser);

  assertEquals(result.code, 400);
  assertEquals(result.message, "Erro ao remover produto.");
});

// DELETE - Negative - invalid id
Deno.test("should not delete a product - invalid id", async () => {
  const user = await UserModel.findOne({ email: testEmailSeller });
  assertExists(user, "Usuário deveria existir.");

  const MockRequest = {
    params: { id: "id_invalido" },
    user: {
      _id: user._id.toString(),
      role: user.role,
    },
  } as unknown as Request;

  const result = await productsController.delete(MockRequest, MockResponser);

  assertEquals(result.code, 400);
  assertEquals(result.message, "Erro ao remover produto.");
});

// DELETE - Negative - product not found
Deno.test("should not delete a product - not found", async () => {
  const user = await UserModel.findOne({ email: testEmailSeller });
  assertExists(user, "Usuário deveria existir.");

  const MockRequest = {
    params: { id: new mongoose.Types.ObjectId().toString() },
    user: {
      _id: user._id.toString(),
      role: user.role,
    },
  } as unknown as Request;

  const result = await productsController.delete(MockRequest, MockResponser);

  assertEquals(result.code, 400);
  assertEquals(result.message, "Erro ao remover produto.");
});

// DELETE - Positive
Deno.test("should delete a product", async () => {
  const user = await UserModel.findOne({ email: testEmailSeller });
  const product = await ProductModel.findOne({ title: "Test Product" });
  assertExists(user, "Usuário deveria existir.");
  assertExists(product, "Produto deveria existir.");

  const MockRequest = {
    params: { id: product._id.toString() },
    user: {
      _id: user._id.toString(),
      role: user.role,
    },
  } as unknown as Request;

  const result = await productsController.delete(MockRequest, MockResponser);

  assertEquals(result.code, 200);
  assertEquals(result.message.message, "Produto removido com sucesso!");
});

