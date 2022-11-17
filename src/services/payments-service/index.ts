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

async function postPayment(userId: number, body: CreatePaymentParams): Promise<Payment> {
  const ticket = await ticketRepository.findTicketById(body.ticketId);

  if (!ticket) throw notFoundError();

  if (ticket.Enrollment.userId !== userId) throw unauthorizedError();

  const updatedTicket = await ticketRepository.updateTicketStatus(body.ticketId);

  const createPayment = {
    value: updatedTicket.TicketType.price,
    cardIssuer: body.cardData.issuer,
    cardLastDigits: body.cardData.number.toString().slice(-4),
    ticketId: body.ticketId,
  };

  const payment = await paymentRepository.createPayment(createPayment);

  return payment;
}

export type FindPaymentParams = { ticketId: string };

export type CreatePaymentParams = {
  ticketId: number;
  cardData: {
    issuer: string;
    number: number;
    name: string;
    expirationDate: Date;
    cvv: number;
  };
};

const paymentsService = {
  getUserPayment,
  postPayment,
};

export default paymentsService;
