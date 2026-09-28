import mongoose from "mongoose";
import { OrderModel } from "../models/Order/Order.ts";
import { ProductModel } from "../models/Product/Product.ts";
import { OrderClass } from "../models/Order/Order.ts";
import { IOrder } from "../models/Order/IOrder.ts";
import { throwlhos } from "../globals/Throwlhos.ts";
import { Types } from "mongoose";
import { userRole } from "../models/User/IUser.ts";
import { UserModel } from "../models/User/User.ts";

export class OrderService {
  async createSimpleOrder(
    customerId: Types.ObjectId,
    productId: string,
    quantity: number = 1,
  ): Promise<IOrder> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const product = await ProductModel.findById(productId).session(session);

      if (!product) {
        throw throwlhos.err_badRequest("Produto não encontrado no sistema.");
      }

      const customer = await UserModel.findById(customerId).session(session);
      if (!customer) {
        throw throwlhos.err_badRequest("Cliente não encontrado no sistema.");
      }

      if (product.stock < quantity) {
        throw throwlhos.err_badRequest(
          `Estoque insuficiente. Apenas ${product.stock} unidade(s) disponível(is).`,
        );
      }

      product.stock -= quantity;
      await product.save({ session });

      const orderEntity = new OrderClass({
        customer: {
          _id: customer._id,
          name: customer.name,
          email: customer.email,
        },
        product: {
          _id: product._id,
          title: product.title,
          price: product.price,
        },
        seller: product.user,
        totalAmount: product.price * quantity,
        quantity: quantity,
        status: "pending",
      });

      const [newOrder] = await OrderModel.create([orderEntity], { session });

      await session.commitTransaction();
      session.endSession();

      return newOrder;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      throw error;
    }
  }

  async getOrders(customerId: string): Promise<IOrder[]> {
    return await OrderModel.find().where("customer._id").equals(customerId)
      .sort({ createdAt: -1 });
  }

  async getSales(sellerId: string): Promise<IOrder[]> {
    return await OrderModel.find().where("seller._id").equals(sellerId)
      .sort({ createdAt: -1 });
  }

  async cancelOrder(orderId: string, userId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await OrderModel.findById(orderId).session(session);

      if (!order) {
        throw throwlhos.err_notFound("Pedido não encontrado.");
      }

      const isCustomer = order.customer._id.toString() === userId;
      const isSeller = order.seller._id.toString() === userId;

      if (!isCustomer && !isSeller) {
        throw throwlhos.err_forbidden(
          "Você não tem permissão para cancelar este pedido.",
        );
      }

      if (order.status === "canceled") {
        throw throwlhos.err_badRequest("Este pedido já se encontra cancelado.");
      }

      order.status = "canceled";
      await order.save({ session });

      await ProductModel.findByIdAndUpdate(
        order.product._id,
        { $inc: { stock: order.quantity } },
        { session, new: true },
      );

      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async markAsPaid(
    orderId: string,
    userRoleRequest: string,
    userId: string | Types.ObjectId,
  ): Promise<IOrder> {
    const order = await OrderModel.findById(orderId);

    if (!order) {
      throw throwlhos.err_notFound("Pedido não encontrado.");
    }

    if (order.status === "canceled") {
      throw throwlhos.err_badRequest(
        "Não é possível pagar um pedido que já foi cancelado.",
      );
    }

    if (order.status === "paid") {
      throw throwlhos.err_badRequest("Este pedido já está pago.");
    }

    const ownerId = order.seller._id.toString();

    const isSeller = userRoleRequest === userRole.SELLER;
    const isAdmin = userRoleRequest === userRole.ADMIN;
    const isOwner = ownerId === userId.toString();

    if (!isSeller && !isAdmin) {
      throw throwlhos.err_unauthorized(
        "Acesso negado: Você não tem permissão para alterar o status para pago.",
      );
    }

    if (!isOwner) {
      throw throwlhos.err_unauthorized(
        "Acesso negado: Você não tem permissão para alterar o status para pago.",
      );
    }

    order.status = "paid";
    const updatedOrder = await order.save();

    return updatedOrder;
  }

  async deleteOrder(orderId: string, userId: string, userRoleRequest: string) {
    const order = await OrderModel.findById(orderId);

    if (!order) {
      throw throwlhos.err_notFound("Pedido não encontrado.");
    }

    const customerId = order.customer._id.toString();
    const isCustomer = customerId === userId;
    const isAdmin = userRoleRequest === userRole.ADMIN;

    if (!isCustomer && !isAdmin) {
      throw throwlhos.err_forbidden(
        "Você não tem permissão para deletar este pedido.",
      );
    }

    if (order.status !== "canceled") {
      throw throwlhos.err_badRequest(
        `Não é possível deletar um pedido com status '${order.status}'. Cancele o pedido antes de excluí-lo.`,
      );
    }

    await OrderModel.findByIdAndDelete(orderId);
  }
}
