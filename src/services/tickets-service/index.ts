import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { Address, Enrollment, Ticket, TicketType } from "@prisma/client";

async function getTicketTypes(): Promise<TicketType[]> {
  const types = await ticketRepository.findTypes();

  return types;
}

async function getTicketFromUser(userId: number): Promise<Ticket> {
  const { id: enrollmentId } = await getEnrollmentFromUserByUserId(userId);

  const ticketFromUser = await ticketRepository.findTicketByEnrollmentId(enrollmentId);

  if (!ticketFromUser) throw notFoundError();

  return ticketFromUser;
}

async function postTicket(userId: number, ticketTypeId: number): Promise<Ticket> {
  const { id: enrollmentId } = await getEnrollmentFromUserByUserId(userId);

  const createdTicket = await ticketRepository.createTicket({ enrollmentId: enrollmentId, ticketTypeId });

  return createdTicket;
}

async function getEnrollmentFromUserByUserId(userId: number): Promise<getEnrollmentFromUserByUserIdResult> {
  const enrollmentFromUser = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollmentFromUser) throw notFoundError();

  return enrollmentFromUser;
}

type getEnrollmentFromUserByUserIdResult = Enrollment & {
  Address: Address[];
};

export type PostTicketParams = { ticketTypeId: number | undefined };

const ticketsService = {
  getTicketTypes,
  getTicketFromUser,
  postTicket,
};

export default ticketsService;
