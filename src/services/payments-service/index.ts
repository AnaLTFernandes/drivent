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

async function postPayment(userId: number, { ticketId, cardData }: CreatePaymentParams): Promise<Payment> {
  const ticket = await ticketRepository.findTicketById(ticketId);

  if (!ticket) throw notFoundError();

  if (ticket.Enrollment.userId !== userId) throw unauthorizedError();

  const updatedTicket = await ticketRepository.updateTicketStatus(ticketId);

  const createPayment = {
    ticketId,
    cardIssuer: cardData.issuer,
    cardLastDigits: cardData.number.slice(-4),
    value: updatedTicket.TicketType.price,
  };

  const payment = await paymentRepository.createPayment(createPayment);

  return payment;
}

export type CreatePaymentParams = {
  ticketId: number;
  cardData: {
    issuer: string;
    number: string;
    name: string;
    expirationDate: string;
    cvv: string;
  };
};

const paymentsService = {
  getUserPayment,
  postPayment,
};

export default paymentsService;
