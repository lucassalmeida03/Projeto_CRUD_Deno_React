import { Router } from "express"
import { usersController } from "../controllers/UserController.ts"

const usersRoutes = new Router()
const UsersController = new usersController()

usersRoutes.post("/user", UsersController.create)

export { usersRoutes }




