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
  await OrderModel.deleteMany({
    $or: [
      { customer: { $in: await getTestUserIds() } },
      { seller: { $in: await getTestUserIds() } },
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

// CREATE - Positive
Deno.test("should create an order successfully", async () => {
  const seller = await UserModel.findOne({ email: sellerEmail }) ?? await UserModel.create({
    name: "Order Seller",
    email: sellerEmail,
    password: "senhaSegura123",
    role: userRole.SELLER,
  });

  const customer = await UserModel.findOne({ email: customerEmail }) ?? await UserModel.create({
    name: "Order Customer",
    email: customerEmail,
    password: "senhaSegura123",
    role: userRole.CUSTOMER,
  });

  const product = await ProductModel.findOne({ title: "Order Test Product" }) ?? await ProductModel.create({
    title: "Order Test Product",
    price: 50,
    stock: 10,
    description: "Product used for order tests.",
    user: seller._id,
  });

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
  const seller = await UserModel.findOne({ email: sellerEmail }) ?? await UserModel.create({
    name: "Order Seller",
    email: sellerEmail,
    password: "senhaSegura123",
    role: userRole.SELLER,
  });

  const customer = await UserModel.findOne({ email: customerEmail }) ?? await UserModel.create({
    name: "Order Customer",
    email: customerEmail,
    password: "senhaSegura123",
    role: userRole.CUSTOMER,
  });

  const product = await ProductModel.findOne({ title: "Order Test Product" }) ?? await ProductModel.create({
    title: "Order Test Product",
    price: 50,
    stock: 10,
    description: "Product used for order tests.",
    user: seller._id,
  });

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

// CREATE - Negative - authorization
Deno.test("should not create an order - missing user id", async () => {
  const seller = await UserModel.findOne({ email: sellerEmail }) ?? await UserModel.create({
    name: "Order Seller",
    email: sellerEmail,
    password: "senhaSegura123",
    role: userRole.SELLER,
  });

  const product = await ProductModel.findOne({ title: "Order Test Product" }) ?? await ProductModel.create({
    title: "Order Test Product",
    price: 50,
    stock: 10,
    description: "Product used for order tests.",
    user: seller._id,
  });

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
  const customer = await UserModel.findOne({ email: customerEmail }) ?? await UserModel.create({
    name: "Order Customer",
    email: customerEmail,
    password: "senhaSegura123",
    role: userRole.CUSTOMER,
  });

  const MockRequest = {
    user: {
      _id: customer._id.toString(),
      role: customer.role,
    },
  } as unknown as Request;

  const result = await ordersController.getOrders(MockRequest, MockResponser);

  assertEquals(result.code, 200);
  assertEquals(result.message, "Operação concluída");
  assertExists(result.data);
  assertEquals(Array.isArray(result.data.data), true);
});

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
  const seller = await UserModel.findOne({ email: sellerEmail }) ?? await UserModel.create({
    name: "Order Seller",
    email: sellerEmail,
    password: "senhaSegura123",
    role: userRole.SELLER,
  });

  const MockRequest = {
    user: {
      _id: seller._id.toString(),
      role: seller.role,
    },
  } as unknown as Request;

  const result = await ordersController.getSales(MockRequest, MockResponser);

  assertEquals(result.code, 200);
  assertEquals(result.message, "Operação concluída");
  
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
  const seller = await UserModel.findOne({ email: sellerEmail }) ?? await UserModel.create({
    name: "Order Seller",
    email: sellerEmail,
    password: "senhaSegura123",
    role: userRole.SELLER,
  });

  const customer = await UserModel.findOne({ email: customerEmail }) ?? await UserModel.create({
    name: "Order Customer",
    email: customerEmail,
    password: "senhaSegura123",
    role: userRole.CUSTOMER,
  });

  const product = await ProductModel.findOne({ title: "Order Test Product" }) ?? await ProductModel.create({
    title: "Order Test Product",
    price: 50,
    stock: 10,
    description: "Product used for order tests.",
    user: seller._id,
  });

  const order = await OrderModel.create({
    customer: customer._id,
    product: product._id,
    seller: seller._id,
    totalAmount: product.price,
    quantity: 1,
    status: "pending",
  });

  const MockRequest = {
    params: { id: order._id.toString() },
    user: {
      _id: customer._id.toString(),
      role: customer.role,
    },
  } as unknown as Request;

  const result = await ordersController.cancel(MockRequest, MockResponser);

  assertEquals(result.code, 200);
  assertEquals(result.message, "Pedido cancelado e estoque devolvido com sucesso!");
});

// CANCEL - Negative - authorization
Deno.test("should not cancel an order - authorization failure", async () => {
  const seller = await UserModel.findOne({ email: sellerEmail }) ?? await UserModel.create({
    name: "Order Seller",
    email: sellerEmail,
    password: "senhaSegura123",
    role: userRole.SELLER,
  });

  const customer = await UserModel.findOne({ email: customerEmail }) ?? await UserModel.create({
    name: "Order Customer",
    email: customerEmail,
    password: "senhaSegura123",
    role: userRole.CUSTOMER,
  });

  const secondCustomer = await UserModel.findOne({ email: secondCustomerEmail }) ?? await UserModel.create({
    name: "Second Customer",
    email: secondCustomerEmail,
    password: "senhaSegura123",
    role: userRole.CUSTOMER,
  });

  const product = await ProductModel.findOne({ title: "Order Test Product" }) ?? await ProductModel.create({
    title: "Order Test Product",
    price: 50,
    stock: 10,
    description: "Product used for order tests.",
    user: seller._id,
  });

  const order = await OrderModel.create({
    customer: customer._id,
    product: product._id,
    seller: seller._id,
    totalAmount: product.price,
    quantity: 1,
    status: "pending",
  });

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
  const seller = await UserModel.findOne({ email: sellerEmail }) ?? await UserModel.create({
    name: "Order Seller",
    email: sellerEmail,
    password: "senhaSegura123",
    role: userRole.SELLER,
  });

  const customer = await UserModel.findOne({ email: customerEmail }) ?? await UserModel.create({
    name: "Order Customer",
    email: customerEmail,
    password: "senhaSegura123",
    role: userRole.CUSTOMER,
  });

  const product = await ProductModel.findOne({ title: "Order Test Product" }) ?? await ProductModel.create({
    title: "Order Test Product",
    price: 50,
    stock: 10,
    description: "Product used for order tests.",
    user: seller._id,
  });

  const order = await OrderModel.create({
    customer: customer._id,
    product: product._id,
    seller: seller._id,
    totalAmount: product.price,
    quantity: 1,
    status: "pending",
  });

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
Deno.test("should not mark an order as paid - authorization failure", async () => {
  const seller = await UserModel.findOne({ email: sellerEmail }) ?? await UserModel.create({
    name: "Order Seller",
    email: sellerEmail,
    password: "senhaSegura123",
    role: userRole.SELLER,
  });

  const customer = await UserModel.findOne({ email: customerEmail }) ?? await UserModel.create({
    name: "Order Customer",
    email: customerEmail,
    password: "senhaSegura123",
    role: userRole.CUSTOMER,
  });

  const product = await ProductModel.findOne({ title: "Order Test Product" }) ?? await ProductModel.create({
    title: "Order Test Product",
    price: 50,
    stock: 10,
    description: "Product used for order tests.",
    user: seller._id,
  });

  const order = await OrderModel.create({
    customer: customer._id,
    product: product._id,
    seller: seller._id,
    totalAmount: product.price,
    quantity: 1,
    status: "pending",
  });

  const MockRequest = {
    params: { id: order._id.toString() },
    user: {
      _id: customer._id.toString(),
      role: customer.role,
    },
  } as unknown as Request;

  const result = await ordersController.markAsPaid(MockRequest, MockResponser);

  assertEquals(result.code, 400);
  assertEquals(result.message, "Erro ao atualizar pagamento do pedido.");
});

// DELETE - Positive
Deno.test("should delete a canceled order successfully", async () => {
  const seller = await UserModel.findOne({ email: sellerEmail }) ?? await UserModel.create({
    name: "Order Seller",
    email: sellerEmail,
    password: "senhaSegura123",
    role: userRole.SELLER,
  });

  const customer = await UserModel.findOne({ email: customerEmail }) ?? await UserModel.create({
    name: "Order Customer",
    email: customerEmail,
    password: "senhaSegura123",
    role: userRole.CUSTOMER,
  });

  const product = await ProductModel.findOne({ title: "Order Test Product" }) ?? await ProductModel.create({
    title: "Order Test Product",
    price: 50,
    stock: 10,
    description: "Product used for order tests.",
    user: seller._id,
  });

  const order = await OrderModel.create({
    customer: customer._id,
    product: product._id,
    seller: seller._id,
    totalAmount: product.price,
    quantity: 1,
    status: "canceled",
  });

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
  const seller = await UserModel.findOne({ email: sellerEmail }) ?? await UserModel.create({
    name: "Order Seller",
    email: sellerEmail,
    password: "senhaSegura123",
    role: userRole.SELLER,
  });

  const customer = await UserModel.findOne({ email: customerEmail }) ?? await UserModel.create({
    name: "Order Customer",
    email: customerEmail,
    password: "senhaSegura123",
    role: userRole.CUSTOMER,
  });

  const secondCustomer = await UserModel.findOne({ email: secondCustomerEmail }) ?? await UserModel.create({
    name: "Second Customer",
    email: secondCustomerEmail,
    password: "senhaSegura123",
    role: userRole.CUSTOMER,
  });

  const product = await ProductModel.findOne({ title: "Order Test Product" }) ?? await ProductModel.create({
    title: "Order Test Product",
    price: 50,
    stock: 10,
    description: "Product used for order tests.",
    user: seller._id,
  });

  const order = await OrderModel.create({
    customer: customer._id,
    product: product._id,
    seller: seller._id,
    totalAmount: product.price,
    quantity: 1,
    status: "canceled",
  });

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
  const customer = await UserModel.findOne({ email: customerEmail }) ?? await UserModel.create({
    name: "Order Customer",
    email: customerEmail,
    password: "senhaSegura123",
    role: userRole.CUSTOMER,
  });

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
