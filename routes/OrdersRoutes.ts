import { Router } from "express";
import { OrdersController } from "../controllers/OrdersController.ts";
import { verifyUserAuthorization } from "../middlewares/VerifyUserAuthorization.ts";

const ordersRoutes = Router();
const ordersController = new OrdersController();

ordersRoutes.post("/", ordersController.create);
ordersRoutes.get("/my-orders", verifyUserAuthorization(["customer", "admin"]), ordersController.getOrders);
ordersRoutes.get("/my-sales", verifyUserAuthorization(["seller", "admin"]), ordersController.getSales);
ordersRoutes.patch("/:id/cancel", ordersController.cancel);
ordersRoutes.patch(
  "/:id/pay",
  verifyUserAuthorization(["admin", "seller"]),
  ordersController.markAsPaid
);

export { ordersRoutes };