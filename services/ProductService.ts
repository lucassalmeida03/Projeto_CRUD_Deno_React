import { ProductModel, ProductClass } from "../models/Product/Product.ts";
import { IProduct } from "../models/Product/IProduct.ts";
import { throwlhos } from "../globals/Throwlhos.ts";

export class ProductService {
  async createProduct(productData: IProduct): Promise<IProduct> {
    const productEntity = new ProductClass(productData);
    return await ProductModel.create(productEntity);
  }

  async getAllProducts(): Promise<IProduct[]> {
    return await ProductModel.find();
  }

  async getProductById(id: string): Promise<IProduct> {
    const product = await ProductModel.findById(id);
    if (!product) {
      throw throwlhos.err_notFound("Produto não encontrado.");
    }
    return product;
  }

  async updateProduct(id: string, updateData: Partial<IProduct>): Promise<IProduct> {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      throw throwlhos.err_notFound("Produto não encontrado para atualização.");
    }

    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    const result = await ProductModel.findByIdAndDelete(id);
    if (!result) {
      throw throwlhos.err_notFound("Produto não encontrado para remoção.");
    }
  }
}