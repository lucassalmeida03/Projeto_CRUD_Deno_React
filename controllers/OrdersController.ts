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
      
      const { orderId } = req.params._id;
      const userId = req.user._id;

      const canceledOrder = await this.orderService.cancelOrder(orderId, userId)

      return res.send_ok("Pedido cancelado e estoque devolvido com sucesso!", { data: canceledOrder }
      );

    } catch (error) {
  
      return res.send_badRequest("Erro ao cancelar o pedido.", error)
    }
  };

}



export { OrdersController };
