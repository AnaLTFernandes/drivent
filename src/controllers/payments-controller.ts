import { Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";
import paymentsService, { FindPaymentParams } from "@/services/payments-service";

export async function getUserPayment(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketId } = req.query as FindPaymentParams;

  if (!ticketId) return res.sendStatus(httpStatus.BAD_REQUEST);

  const ticket = Number(ticketId);

  try {
    const payment = await paymentsService.getUserPayment(userId, ticket);

    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}
