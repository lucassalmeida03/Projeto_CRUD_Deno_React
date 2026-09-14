import { Router } from "express"
import { usersRoutes } from "./UserRoutes.ts"

const routes = new Router()

routes.use(usersRoutes)

export {routes}