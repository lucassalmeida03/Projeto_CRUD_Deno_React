import { Request, Response } from "express";
import { OrderService } from "../services/OrderService.ts";
import { throwlhos } from "../globals/Throwlhos.ts";

class OrdersController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  create = async (req: Request, res: Response) => {
    try {
      const customerId = req.user._id;
      const customerRole = req.user.role;
      const { productId, quantity = 1 } = req.body;

      if (!customerId) {
        throw throwlhos.err_forbidden("Não autorizado.");
      }

      const order = await this.orderService.createSimpleOrder(
        customerId,
        customerRole,
        productId,
        quantity,
      );

      return res.send_created("Produto adquirido com sucesso!", {
        data: order,
      });
    } catch (error) {
      return res.send_badRequest("Não foi possível concluir a ação", error);
    }
  };

  getOrders = async (req: Request, res: Response) => {
    try {
      const customerId = req.user._id;

      if (!req.user._id) {
        throw throwlhos.err_badRequest("User sem ID especificado.");
      }

      const requestedPage = Number(req.query.page);
      const requestedLimit = Number(req.query.limit);
      const page = Number.isInteger(requestedPage) && requestedPage > 0
        ? requestedPage
        : 1;
      const limit = Number.isInteger(requestedLimit) && requestedLimit > 0
        ? Math.min(requestedLimit, 7)
        : 7;

      const result = await this.orderService.getOrders(
        customerId,
        page,
        limit,
      );

      return res.send_ok("Operação concluída", result);
    } catch (error) {
      return res.send_badRequest("Erro ao buscar histórico de compras.", error);
    }
  };

  getSales = async (req: Request, res: Response) => {
    try {
      const sellerId = req.user._id;

      if (!req.user._id) {
        throw throwlhos.err_badRequest("User sem ID especificado.");
      }

      const requestedPage = Number(req.query.page);
      const requestedLimit = Number(req.query.limit);
      const page = Number.isInteger(requestedPage) && requestedPage > 0
        ? requestedPage
        : 1;
      const limit = Number.isInteger(requestedLimit) && requestedLimit > 0
        ? Math.min(requestedLimit, 7)
        : 7;

      const result = await this.orderService.getSales(sellerId, page, limit);

      return res.send_ok("Operação concluída", result);
    } catch (error) {
      return res.send_badRequest("Erro ao buscar histórico de vendas.", error);
    }
  };

  cancel = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const canceledOrder = await this.orderService.cancelOrder(id, userId);

      return res.send_ok("Pedido cancelado e estoque devolvido com sucesso!", {
        data: canceledOrder,
      });
    } catch (error) {
      return res.send_badRequest("Erro ao cancelar o pedido.", error);
    }
  };

  markAsPaid = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { _id, role } = req.user;
      const updatedOrder = await this.orderService.markAsPaid(id, role, _id);

      return res.send_ok("Pagamento do pedido atualizado com sucesso!", {
        data: updatedOrder,
      });
    } catch (error) {
      return res.send_badRequest(
        "Erro ao atualizar pagamento do pedido.",
        error,
      );
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const userRole = req.user.role;

      await this.orderService.deleteOrder(id, userId, userRole);

      return res.send_ok("Pedido cancelado foi removido com sucesso!");
    } catch (error) {
      return res.send_badRequest("Erro ao excluir pedido.", error);
    }
  };
}

export { OrdersController };
