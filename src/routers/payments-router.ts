import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getUserPayment, postPayment } from "@/controllers/payments-controller";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", getUserPayment)
  .post("/process", postPayment);

export { paymentsRouter };
