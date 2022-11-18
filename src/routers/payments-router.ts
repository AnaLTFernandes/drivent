import { Router } from "express";
import { createPaymentSchema } from "@/schemas";
import { authenticateToken, validateBody } from "@/middlewares";
import { getUserPayment, postPayment } from "@/controllers";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", getUserPayment)
  .post("/process", validateBody(createPaymentSchema), postPayment);

export { paymentsRouter };
