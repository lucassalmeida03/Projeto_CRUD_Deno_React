import { Router } from "express";
import { sessionsController } from "../controllers/SessionsController.ts";

const sessionsRoutes = new Router();
const SessionsController = new sessionsController();

sessionsRoutes.post("/", SessionsController.createSession);

export { sessionsRoutes };
