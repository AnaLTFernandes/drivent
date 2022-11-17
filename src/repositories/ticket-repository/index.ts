import { prisma } from "@/config";

async function findTypes() {
  return prisma.ticketType.findMany();
}

async function findTicketByEnrollmentId(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: { enrollmentId },
    select: {
      id: true,
      status: true,
      ticketTypeId: true,
      enrollmentId: true,
      TicketType: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

async function createTicket(createTicket: CreateTicketParams) {
  return prisma.ticket.create({
    data: {
      status: "RESERVED",
      ticketTypeId: createTicket.ticketTypeId,
      enrollmentId: createTicket.enrollmentId,
    },
    select: {
      id: true,
      status: true,
      ticketTypeId: true,
      enrollmentId: true,
      TicketType: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export type CreateTicketParams = { enrollmentId: number; ticketTypeId: number };

const ticketRepository = {
  findTypes,
  findTicketByEnrollmentId,
  createTicket,
};

export default ticketRepository;
