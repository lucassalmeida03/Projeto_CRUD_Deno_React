import { Router } from "express";
import { usersRoutes } from "./UserRoutes.ts";
import { sessionsRoutes } from "./SessionsRoutes.ts";
import { ensureAuthenticated } from "../middlewares/EnsureAuthenticated.ts";
import { productsRoutes } from "./ProductsRoutes.ts";
import { ordersRoutes } from "./OrdersRoutes.ts";

const routes = new Router();

// Rotas públicas
routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);

// Rotas privadas
routes.use(ensureAuthenticated);
routes.use("/products", productsRoutes);
routes.use("/orders", ordersRoutes);

export { routes };
