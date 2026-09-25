import { ProductClass, ProductModel } from "../models/Product/Product.ts";
import { IProduct } from "../models/Product/IProduct.ts";
import { userRole } from "../models/User/IUser.ts";
import { throwlhos } from "../globals/Throwlhos.ts";
import { isValidObjectId } from "mongoose";
import { UserModel } from "../models/User/User.ts";

class ProductService {
  async createProduct(productData: IProduct): Promise<IProduct> {
    const productEntity = new ProductClass(productData);

    const newProduct = await ProductModel.create(productEntity);

    await UserModel.findByIdAndUpdate(productData.user, {
      $push: { products: newProduct._id },
    });

    return newProduct;
  }

  async getAllProducts(): Promise<IProduct[]> {
    return await ProductModel.find().populate("user", "name email role");
  }

  async findBySellerId(sellerId: string): Promise<IProduct[]> {
    return await ProductModel.find({ user: sellerId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
  }

  async updateProduct(
    id: string,
    updateData: Partial<IProduct>,
    userId: string,
    userRoleRequest: string,
  ): Promise<IProduct> {
    if (!isValidObjectId(id)) {
      throw throwlhos.err_badRequest("ID do produto inválido.");
    }

    const product = await ProductModel.findById(id);

    if (!product) {
      throw throwlhos.err_badRequest("Produto não encontrado.");
    }

    if (!product.user._id) {
      throw throwlhos.err_badRequest("Id do dono do produto inexistente.");
    }

    const ownerId = typeof product.user === "object" && "_id" in product.user
      ? product.user._id.toString()
      : product.user.toString();

    const isOwner = ownerId === userId;
    const isAdmin = userRoleRequest === userRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw throwlhos.err_unauthorized(
        "Acesso negado: Você não tem permissão para alterar este produto.",
      );
    }

    Object.assign(product, updateData);
    await product.save();

    return await product.populate("user", "name email role");
  }

  async deleteProduct(
    productId: string,
    userId: string,
    userRoleRequest: string,
  ): Promise<void> {
    if (!isValidObjectId(productId)) {
      throw throwlhos.err_badRequest("ID do produto inválido.");
    }

    const product = await ProductModel.findById(productId);

    if (!product) {
      throw throwlhos.err_badRequest("Produto não encontrado.");
    }

    if (!product.user._id) {
      throw throwlhos.err_badRequest("Id do usuário inexistente.");
    }

    const ownerId = typeof product.user === "object" && "_id" in product.user
      ? product.user._id.toString()
      : product.user.toString();

    const isOwner = ownerId === userId;
    const isAdmin = userRoleRequest === userRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw throwlhos.err_unauthorized(
        "Acesso negado: Você não tem permissão para remover este produto.",
      );
    }

    await ProductModel.findByIdAndDelete(productId);

    await UserModel.findByIdAndUpdate(userId, {
      $pull: { products: productId },
    });
  }
}

export { ProductService };
