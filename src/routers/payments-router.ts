import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getUserPayment } from "@/controllers/payments-controller";

const paymentsRouter = Router();

paymentsRouter.all("/*", authenticateToken).get("/", getUserPayment);

export { paymentsRouter };
