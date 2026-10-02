import { Router } from "express";
import { OrdersController } from "../controllers/OrdersController.ts";
import { verifyUserAuthorization } from "../middlewares/VerifyUserAuthorization.ts";

const ordersRoutes = Router();
const ordersController = new OrdersController();

ordersRoutes.post(
  "/",
  verifyUserAuthorization(["customer"]),
  ordersController.create,
);
ordersRoutes.get(
  "/my-orders",
  verifyUserAuthorization(["customer"]),
  ordersController.getOrders,
);
ordersRoutes.get(
  "/my-sales",
  verifyUserAuthorization(["seller", "admin"]),
  ordersController.getSales,
);
ordersRoutes.patch(
  "/:id/cancel",
  verifyUserAuthorization(["customer", "seller"]),
  ordersController.cancel,
);
ordersRoutes.patch(
  "/:id/pay",
  verifyUserAuthorization(["admin", "seller"]),
  ordersController.markAsPaid,
);

ordersRoutes.delete(
  "/:id/delete",
  verifyUserAuthorization(["customer"]),
  ordersController.delete,
);

export { ordersRoutes };
