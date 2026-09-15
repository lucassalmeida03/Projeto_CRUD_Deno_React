import { Request, Response } from "express";
import requestCheck from "request-check";
import is from "@zarco/isness";
import { ProductService } from "../services/ProductService.ts";
import { throwlhos } from "../globals/Throwlhos.ts";

const rc = requestCheck.default();

rc.addRule("title", {
  validator: (value: string) => is.string(value) && value.trim().length >= 2,
  message: "O título do produto deve ter pelo menos 2 caracteres.",
});

rc.addRule("price", {
  validator: (value: number) => is.number(value) && value >= 0,
  message: "O preço deve ser um número válido maior ou igual a zero.",
});

rc.addRule("stock", {
  validator: (value: number) => is.number(value) && value >= 0,
  message: "O estoque deve ser um número inteiro maior ou igual a zero.",
});

class ProductsController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  create = async (req: Request, res: Response) => {
    try {
      const errors = rc.check(req.body);
      if (errors) {
        return res.send_badRequest("Request is wrong!", { errors });
      }

      if (!req.user._id) {
        throw throwlhos.err_forbidden("Não autorizado.");
      }
      const productPayload = {
        ...req.body,
        user: req.user._id,
      };
      console.log(productPayload);
      const newProduct = await this.productService.createProduct(
        productPayload,
      );

      return res.send_created("Produto cadastrado com sucesso!", {
        data: newProduct,
      });
    } catch (error) {
      return res.send_badRequest("Erro ao criar produto.", { error });
    }
  };

  getAll = async (_req: Request, res: Response) => {
    try {
      const products = await this.productService.getAllProducts();
      return res.send_ok({ success: true, data: products });
    } catch (error) {
      return res.send_badRequest("Erro ao listar produtos.", { error });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const product = await this.productService.getProductById(id);

      return res.send_ok({ success: true, data: product });
    } catch (error) {
      return res.send_badRequest("Produto não encontrado.", { error });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const errors = rc.check(req.body);

      if (errors) {
        return res.send_badRequest("Request is wrong!", { errors });
      }

      const { _id, role } = req.user;

      const updatedProduct = await this.productService.updateProduct(
        id,
        req.body,
        _id,
        role,
      );

      return res.send_ok({
        success: true,
        message: "Produto atualizado com sucesso!",
        data: updatedProduct,
      });
    } catch (error) {
      return res.send_badRequest("Erro ao atualizar produto.", { error });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { _id, role } = req.user;

      await this.productService.deleteProduct(id, _id, role);
      return res.send_ok({
        success: true,
        message: "Produto removido com sucesso!",
      });
    } catch (error) {
      return res.send_badRequest("Erro ao remover produto.", { error });
    }
  };
}

export { ProductsController };
