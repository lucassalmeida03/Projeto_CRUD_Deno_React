import mongoose from "mongoose";
import { OrderModel } from "../models/Order/Order.ts";
import { ProductModel } from "../models/Product/Product.ts";
import { OrderClass } from "../models/Order/Order.ts";
import { IOrder } from "../models/Order/IOrder.ts";
import { throwlhos } from "../globals/Throwlhos.ts";
import { Types } from "mongoose";
import { IUser } from "../models/User/IUser.ts";

export class OrderService {
 async createSimpleOrder(
  customerId: Types.ObjectId | IUser,
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

    if (product.stock < quantity) {
      throw throwlhos.err_badRequest(
        `Estoque insuficiente. Apenas ${product.stock} unidade(s) disponível(is).`
      );
    }

    
    product.stock -= quantity;
    await product.save({ session })

   
    const orderEntity = new OrderClass({
      customer: customerId,
      product: product._id,
      seller: product.user,
      totalAmount: product.price * quantity, 
      quantity: quantity,
      status: "pending",
    });

    const [newOrder] = await OrderModel.create([orderEntity], { session });

  
    await session.commitTransaction();
    session.endSession();

    return await newOrder.populate([
      { path: "product", select: "title price" },
      { path: "seller", select: "name email" },
      { path: "customer", select: "name email" },
    ]);
  } catch (error) {

    await session.abortTransaction();
    session.endSession();

    throw error;
  }
}

  async getOrders(customerId: string): Promise<IOrder[]> {
    return await OrderModel.find({ customer: customerId })
      .populate("product", "title price image")
      .populate("seller", "name email")
      .sort({ createdAt: -1 });
  }

 
  async getSales(sellerId: string): Promise<IOrder[]> {
    return await OrderModel.find({ seller: sellerId })
      .populate("product", "title price")
      .populate("customer", "name email")
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


      const isCustomer = String(order.customer) === userId;
      const isSeller = String(order.seller) === userId;

      if (!isCustomer && !isSeller) {
        throw throwlhos.err_forbidden("Você não tem permissão para cancelar este pedido.");
      }

   
      if (order.status === "canceled") {
        throw throwlhos.err_badRequest("Este pedido já se encontra cancelado.");
      }

    
      order.status = "canceled";
      await order.save({ session });


      await ProductModel.findByIdAndUpdate(
        order.product,
        { $inc: { stock: order.quantity } },
        { session, new: true }
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
  
}
