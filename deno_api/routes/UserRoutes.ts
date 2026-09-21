import { Router } from "express";
import { usersController } from "../controllers/UserController.ts";
import { ensureAuthenticated } from "../middlewares/EnsureAuthenticated.ts";
import { verifyUserAuthorization } from "../middlewares/VerifyUserAuthorization.ts";

const usersRoutes = new Router();
const UsersController = new usersController();

usersRoutes.post("/", UsersController.create);

usersRoutes.get(
  "/",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  UsersController.getAll,
);

usersRoutes.put("/:id", ensureAuthenticated, UsersController.updateUser);
usersRoutes.delete("/:id", ensureAuthenticated, UsersController.deleteUser);

export { usersRoutes };
