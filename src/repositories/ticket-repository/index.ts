import { prisma } from "@/config";
import { TicketStatus } from "@prisma/client";

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

async function findTicketById(id: number) {
  return prisma.ticket.findFirst({
    where: { id },
    include: {
      Enrollment: true,
    },
  });
}

async function createTicket(createTicket: CreateTicketParams) {
  return prisma.ticket.create({
    data: {
      status: TicketStatus.RESERVED,
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

function updateTicketStatus(id: number) {
  return prisma.ticket.update({
    where: { id },
    data: {
      status: TicketStatus.PAID,
    },
    include: {
      TicketType: true,
    },
  });
}

const ticketRepository = {
  findTypes,
  findTicketByEnrollmentId,
  createTicket,
  findTicketById,
  updateTicketStatus,
};

export default ticketRepository;
