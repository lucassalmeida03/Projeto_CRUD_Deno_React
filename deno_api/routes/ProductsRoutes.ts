import { Router } from "express";
import { ProductsController } from "../controllers/ProductsController.ts";
import { verifyUserAuthorization } from "../middlewares/VerifyUserAuthorization.ts";

const productsRoutes = Router();
const productsController = new ProductsController();

// Apenas admins e sellers podem acessar essas rotas
productsRoutes.post("/", verifyUserAuthorization(["seller", "admin"]), productsController.create);
productsRoutes.put("/:id", verifyUserAuthorization(["seller", "admin"]), productsController.update);
productsRoutes.delete("/:id", verifyUserAuthorization(["seller", "admin"]), productsController.delete);


productsRoutes.get("/", verifyUserAuthorization(["admin", "customer"]), productsController.getAll)
productsRoutes.get("/my-products", verifyUserAuthorization(["seller", "admin"]), productsController.getMyProducts)
productsRoutes.get("/:id", productsController.getById);


export { productsRoutes };