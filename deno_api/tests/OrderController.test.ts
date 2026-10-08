import { assertEquals, assertExists } from "@std/assert";
import mongoose from "mongoose";
import { Request } from "express";
import { connectDB } from "../config/ConnectDB.ts";
import { OrdersController } from "../controllers/OrdersController.ts";
import { UserModel } from "../models/User/User.ts";
import { ProductModel } from "../models/Product/Product.ts";
import { OrderModel } from "../models/Order/Order.ts";
import { MockResponser } from "../globals/mockResponser.ts";
import { userRole } from "../models/User/IUser.ts";

const ordersController = new OrdersController();
const sellerEmail = "order-seller@gmail.com";
const customerEmail = "order-customer@gmail.com";
const secondCustomerEmail = "order-customer-2@gmail.com";

Deno.test.beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }

  await UserModel.deleteMany({
    email: { $in: [sellerEmail, customerEmail, secondCustomerEmail] },
  });

  await UserModel.create([
    {
      name: "Order Seller",
      email: sellerEmail,
      password: "senhaSegura123",
      role: userRole.SELLER,
    },
    {
      name: "Order Customer",
      email: customerEmail,
      password: "senhaSegura123",
      role: userRole.CUSTOMER,
    },
    {
      name: "Second Customer",
      email: secondCustomerEmail,
      password: "senhaSegura123",
      role: userRole.CUSTOMER,
    },
  ]);
});

Deno.test.afterAll(async () => {
  const testUserIds = await getTestUserIds();
  await OrderModel.deleteMany({
    $or: [
      { "customer._id": { $in: testUserIds } },
      { "seller._id": { $in: testUserIds } },
    ],
  });
  await ProductModel.deleteOne({ title: "Order Test Product" });
  await UserModel.deleteMany({
    email: { $in: [sellerEmail, customerEmail, secondCustomerEmail] },
  });
  await mongoose.disconnect();
});

async function getTestUserIds() {
  const users = await UserModel.find({
    email: { $in: [sellerEmail, customerEmail, secondCustomerEmail] },
  }).select("_id");

  return users.map((user) => user._id);
}

async function getTestUser(email: string) {
  const user = await UserModel.findOne({ email });
  assertExists(user, `Usuário de teste não encontrado: ${email}`);
  return user;
}

async function getTestProduct(seller: Awaited<ReturnType<typeof getTestUser>>) {
  const product = await ProductModel.findOne({ title: "Order Test Product" });
  if (product) return product;

  return await ProductModel.create({
    title: "Order Test Product",
    price: 50,
    stock: 10,
    description: "Product used for order tests.",
    seller: seller._id,
  });
}

async function createTestOrder(
  seller: Awaited<ReturnType<typeof getTestUser>>,
  customer: Awaited<ReturnType<typeof getTestUser>>,
  status: "pending" | "paid" | "canceled" = "pending",
) {
  const product = await getTestProduct(seller);

  return await OrderModel.create({
    customer: { _id: customer._id, name: customer.name, email: customer.email },
    product: { _id: product._id, title: product.title, price: product.price },
    seller: { _id: seller._id, name: seller.name, email: seller.email },
    totalAmount: product.price,
    quantity: 1,
    status,
  });
}

// CREATE - Positive
Deno.test("should create an order successfully", async () => {
  const seller = await getTestUser(sellerEmail);
  const customer = await getTestUser(customerEmail);
  const product = await getTestProduct(seller);

  const MockRequest = {
    body: {
      productId: product._id.toString(),
      quantity: 2,
    },
    user: {
      _id: customer._id.toString(),
      role: customer.role,
    },
  } as unknown as Request;

  const result = await ordersController.create(MockRequest, MockResponser);

  assertEquals(result.code, 201);
  assertEquals(result.message, "Produto adquirido com sucesso!");
  assertExists(result.data);
});

// CREATE - Negative - stock
Deno.test("should not create an order - insufficient stock", async () => {
  const seller = await getTestUser(sellerEmail);
  const customer = await getTestUser(customerEmail);
  const product = await getTestProduct(seller);

  const MockRequest = {
    body: {
      productId: product._id.toString(),
      quantity: 999,
    },
    user: {
      _id: customer._id.toString(),
      role: customer.role,
    },
  } as unknown as Request;

  const result = await ordersController.create(MockRequest, MockResponser);

  assertEquals(result.code, 400);
  assertEquals(result.message, "Não foi possível concluir a ação");
});

// CREATE - Negative - validation
Deno.test("should not create an order - validation error", async () => {

const seller = await getTestUser(sellerEmail);
const product = await getTestProduct(seller);

  const MockRequest = {
    body: {
      productId: product._id.toString(),
      quantity: -1,
    },
    user: {},
  } as unknown as Request;

  const result = await ordersController.create(MockRequest, MockResponser);

  assertEquals(result.code, 400);
  assertEquals(result.message, "Erro de validação!");

});

// CREATE - Negative - authorization
Deno.test("should not create an order - missing user id", async () => {
  const seller = await getTestUser(sellerEmail);
  const product = await getTestProduct(seller);

  const MockRequest = {
    body: {
      productId: product._id.toString(),
      quantity: 1,
    },
    user: {},
  } as unknown as Request;

  const result = await ordersController.create(MockRequest, MockResponser);

  assertEquals(result.code, 400);
  assertEquals(result.message, "Não foi possível concluir a ação");
});

// GETORDERS - Positive
Deno.test("should get customer orders successfully", async () => {
  const customer = await getTestUser(customerEmail);

  const MockRequest = {
    user: {
      _id: customer._id.toString(),
      role: customer.role,
    },
    query: {},
  } as unknown as Request;

  const result = await ordersController.getOrders(MockRequest, MockResponser);

  assertEquals(result.code, 200);
  assertEquals(result.message, "Operação concluída");
  assertExists(result.data);
  assertEquals(Array.isArray(result.data.orders), true);
});

Deno.test("should get customer orders with valid pagination", async () => {
  const customer = await getTestUser(customerEmail);

  const MockRequest = {
    user: { _id: customer._id.toString(), role: customer.role },
    query: { page: "2", limit: "10" },
  } as unknown as Request;

  const result = await ordersController.getOrders(MockRequest, MockResponser);

  assertEquals(result.code, 200);
  assertEquals(result.message, "Operação concluída");
  assertExists(result.data);
});

Deno.test(
  "should get customer orders with non-positive pagination",
  async () => {
    const customer = await getTestUser(customerEmail);

    const MockRequest = {
      user: { _id: customer._id.toString(), role: customer.role },
      query: { page: "0", limit: "0" },
    } as unknown as Request;

    const result = await ordersController.getOrders(MockRequest, MockResponser);

    assertEquals(result.code, 200);
    assertEquals(result.message, "Operação concluída");
    assertExists(result.data);
  },
);

// GETORDERS - Negative
Deno.test("should not get customer orders - user missing", async () => {
  const MockRequest = {
    user: {},
  } as unknown as Request;

  const result = await ordersController.getOrders(MockRequest, MockResponser);

  assertEquals(result.code, 400);
  assertEquals(result.message, "Erro ao buscar histórico de compras.");
});

// GETSALES - Positive
Deno.test("should get seller sales successfully", async () => {
  const seller = await getTestUser(sellerEmail);

  const MockRequest = {
    user: {
      _id: seller._id.toString(),
      role: seller.role,
    },
    query: {},
  } as unknown as Request;

  const result = await ordersController.getSales(MockRequest, MockResponser);

  assertEquals(result.code, 200);
  assertEquals(result.message, "Operação concluída");
  assertExists(result.data);
});

Deno.test("should get seller sales with valid pagination", async () => {
  const seller = await getTestUser(sellerEmail);

  const MockRequest = {
    user: { _id: seller._id.toString(), role: seller.role },
    query: { page: "2", limit: "10" },
  } as unknown as Request;

  const result = await ordersController.getSales(MockRequest, MockResponser);

  assertEquals(result.code, 200);
  assertEquals(result.message, "Operação concluída");
  assertExists(result.data);
});

Deno.test("should get seller sales with non-positive pagination", async () => {
  const seller = await getTestUser(sellerEmail);

  const MockRequest = {
    user: { _id: seller._id.toString(), role: seller.role },
    query: { page: "0", limit: "0" },
  } as unknown as Request;

  const result = await ordersController.getSales(MockRequest, MockResponser);

  assertEquals(result.code, 200);
  assertEquals(result.message, "Operação concluída");
  assertExists(result.data);
});

// GETSALES - Negative
Deno.test("should not get seller sales - user missing", async () => {
  const MockRequest = {
    user: {},
  } as unknown as Request;

  const result = await ordersController.getSales(MockRequest, MockResponser);

  assertEquals(result.code, 400);
  assertEquals(result.message, "Erro ao buscar histórico de vendas.");
});

// CANCEL - Positive
Deno.test("should cancel an order successfully", async () => {
  const customer = await getTestUser(customerEmail);
  const order = await createTestOrder(await getTestUser(sellerEmail), customer);

  const MockRequest = {
    params: { id: order._id.toString() },
    user: {
      _id: customer._id.toString(),
      role: customer.role,
    },
  } as unknown as Request;

  const result = await ordersController.cancel(MockRequest, MockResponser);

  assertEquals(result.code, 200);
  assertEquals(
    result.message,
    "Pedido cancelado e estoque devolvido com sucesso!",
  );
});

// CANCEL - Negative - authorization
Deno.test("should not cancel an order - authorization failure", async () => {
  const seller = await getTestUser(sellerEmail);
  const customer = await getTestUser(customerEmail);
  const secondCustomer = await getTestUser(secondCustomerEmail);
  const order = await createTestOrder(seller, customer);

  const MockRequest = {
    params: { id: order._id.toString() },
    user: {
      _id: secondCustomer._id.toString(),
      role: secondCustomer.role,
    },
  } as unknown as Request;

  const result = await ordersController.cancel(MockRequest, MockResponser);

  assertEquals(result.code, 400);
  assertEquals(result.message, "Erro ao cancelar o pedido.");
});

// MARKASPAID - Positive
Deno.test("should mark an order as paid successfully", async () => {
  const seller = await getTestUser(sellerEmail);
  const order = await createTestOrder(seller, await getTestUser(customerEmail));

  const MockRequest = {
    params: { id: order._id.toString() },
    user: {
      _id: seller._id.toString(),
      role: seller.role,
    },
  } as unknown as Request;

  const result = await ordersController.markAsPaid(MockRequest, MockResponser);

  assertEquals(result.code, 200);
  assertEquals(result.message, "Pagamento do pedido atualizado com sucesso!");
});

// MARKASPAID - Negative - authorization
Deno.test(
  "should not mark an order as paid - authorization failure",
  async () => {
    const seller = await getTestUser(sellerEmail);
    const customer = await getTestUser(customerEmail);
    const order = await createTestOrder(seller, customer);

    const MockRequest = {
      params: { id: order._id.toString() },
      user: {
        _id: customer._id.toString(),
        role: customer.role,
      },
    } as unknown as Request;

    const result = await ordersController.markAsPaid(
      MockRequest,
      MockResponser,
    );

    assertEquals(result.code, 400);
    assertEquals(result.message, "Erro ao atualizar pagamento do pedido.");
  },
);

// DELETE - Positive
Deno.test("should delete a canceled order successfully", async () => {
  const customer = await getTestUser(customerEmail);
  const order = await createTestOrder(
    await getTestUser(sellerEmail),
    customer,
    "canceled",
  );

  const MockRequest = {
    params: { id: order._id.toString() },
    user: {
      _id: customer._id.toString(),
      role: customer.role,
    },
  } as unknown as Request;

  const result = await ordersController.delete(MockRequest, MockResponser);

  assertEquals(result.code, 200);
  assertEquals(result.message, "Pedido cancelado foi removido com sucesso!");
});

// DELETE - Negative - authorization
Deno.test("should not delete an order - authorization failure", async () => {
  const customer = await getTestUser(customerEmail);
  const secondCustomer = await getTestUser(secondCustomerEmail);
  const order = await createTestOrder(
    await getTestUser(sellerEmail),
    customer,
    "canceled",
  );

  const MockRequest = {
    params: { id: order._id.toString() },
    user: {
      _id: secondCustomer._id.toString(),
      role: secondCustomer.role,
    },
  } as unknown as Request;

  const result = await ordersController.delete(MockRequest, MockResponser);

  assertEquals(result.code, 400);
  assertEquals(result.message, "Erro ao excluir pedido.");
});

// DELETE - Negative - invalid id
Deno.test("should not delete an order - invalid id", async () => {
  const customer = await getTestUser(customerEmail);

  const MockRequest = {
    params: { id: "id_invalido" },
    user: {
      _id: customer._id.toString(),
      role: customer.role,
    },
  } as unknown as Request;

  const result = await ordersController.delete(MockRequest, MockResponser);

  assertEquals(result.code, 400);
  assertEquals(result.message, "Erro ao excluir pedido.");
});
