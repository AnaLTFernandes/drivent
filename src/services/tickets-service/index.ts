import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { Ticket, TicketType } from "@prisma/client";

async function getTicketTypes(): Promise<TicketType[]> {
  const types = await ticketRepository.findTypes();

  return types;
}

async function getTicketFromUser(userId: number): Promise<Ticket> {
  const enrollmentFromUser = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollmentFromUser) throw notFoundError();

  const ticketFromUser = await ticketRepository.findTicketByEnrollmentId(enrollmentFromUser.id);

  if (!ticketFromUser) throw notFoundError();

  return ticketFromUser;
}

const ticketsService = {
  getTicketTypes,
  getTicketFromUser,
};

export default ticketsService;
