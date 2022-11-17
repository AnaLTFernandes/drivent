import { prisma } from "@/config";

async function findPaymentByTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: { ticketId },
  });
}

async function createPayment(createPaymentParams: CreatePaymentParams) {
  return prisma.payment.create({
    data: createPaymentParams,
  });
}

export type CreatePaymentParams = {
  ticketId: number;
  value: number;
  cardIssuer: string;
  cardLastDigits: string;
};

const paymentRepository = {
  findPaymentByTicketId,
  createPayment,
};

export default paymentRepository;
