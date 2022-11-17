import { notFoundError, unauthorizedError } from "@/errors";
import paymentRepository from "@/repositories/payment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { Payment } from "@prisma/client";

async function getUserPayment(userId: number, ticketId: number): Promise<Payment> {
  const ticket = await ticketRepository.findTicketById(ticketId);

  if (!ticket) throw notFoundError();

  if (ticket.Enrollment.userId !== userId) throw unauthorizedError();

  const payment = await paymentRepository.findPaymentByTicketId(ticketId);

  return payment;
}

export type FindPaymentParams = { ticketId: string };

const paymentsService = {
  getUserPayment,
};

export default paymentsService;
