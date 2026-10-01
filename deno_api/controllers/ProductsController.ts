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
        return res.send_badRequest("Erro de validação!", { errors });
      }

      const seller_id = req.user._id
      if (!seller_id) {
        throw throwlhos.err_forbidden("Não autorizado.");
      }

      const productPayload = {
        ...req.body,
        seller: seller_id
      };

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

  getAll = async (req: Request, res: Response) => {
    try {
      const requestedPage = Number(req.query?.page);
      const requestedLimit = Number(req.query?.limit);
      const page = Number.isInteger(requestedPage) && requestedPage > 0
        ? requestedPage
        : 1;
      const limit = Number.isInteger(requestedLimit) && requestedLimit > 0
        ? Math.min(requestedLimit, 12)
        : 12;

      const result = await this.productService.getAllProducts(page, limit);
      return res.send_ok("Lista de produtos:", result);
    } catch (error) {
      return res.send_badRequest("Erro ao listar produtos.", { error });
    }
  };

  getMyProducts = async (req: Request, res: Response) => {
    try {
      const sellerId = req.user._id;

      if (!sellerId) {
        return res.send_badRequest("ID do vendedor não fornecido.");
      }

      const requestedPage = Number(req.query?.page);
      const requestedLimit = Number(req.query?.limit);
      const page = Number.isInteger(requestedPage) && requestedPage > 0
        ? requestedPage
        : 1;
      const limit = Number.isInteger(requestedLimit) && requestedLimit > 0
        ? Math.min(requestedLimit, 12)
        : 12;

      const result = await this.productService.findBySellerId(
        sellerId,
        page,
        limit,
      );

      return res.send_ok("Busca completa!", result);
    } catch (error) {
      return res.send_badRequest("Erro ao buscar produtos do vendedor.", {
        error,
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const errors = rc.check(req.body);

      if (errors) {
        return res.send_badRequest("Erro de validação!", { errors });
      }

      const { _id, role } = req.user;

      const updatedProduct = await this.productService.updateProduct(
        id,
        req.body,
        _id,
        role,
      );

      return res.send_ok("Produto atualizado com sucesso!", { updatedProduct });
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
