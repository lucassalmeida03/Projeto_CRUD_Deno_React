import { Request, Response } from "express";
import { OrderService } from "../services/OrderService.ts";

class OrdersController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  create = async (req: Request, res: Response) => {
    try {
      const customerId = req.user._id;
      const { productId, quantity = 1 } = req.body;

      const order = await this.orderService.createSimpleOrder(
        customerId,
        productId,
        Number(quantity),
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
      const orders = await this.orderService.getOrders(customerId);

      return res.send_ok("Operação concluída", { data: orders });
    } catch (error) {
      return res.send_badRequest("Erro ao buscar histórico de compras.", error);
    }
  };

  getSales = async (req: Request, res: Response) => {
    try {
      const sellerId = req.user._id;
      const sales = await this.orderService.getSales(sellerId);

      return res.send_ok("Operação concluída", { data: sales });
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
