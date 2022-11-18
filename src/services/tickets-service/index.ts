import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { Address, Enrollment, Ticket, TicketType } from "@prisma/client";

async function getTicketTypes(): Promise<TicketType[]> {
  const types = await ticketRepository.findTypes();

  return types;
}

async function getTicketFromUser(userId: number): Promise<Ticket> {
  const enrollmentFromUser = await getEnrollmentFromUserByUserId(userId);

  if (!enrollmentFromUser) throw notFoundError();

  const ticketFromUser = await ticketRepository.findTicketByEnrollmentId(enrollmentFromUser.id);

  if (!ticketFromUser) throw notFoundError();

  return ticketFromUser;
}

async function postTicket(userId: number, ticketTypeId: number): Promise<Ticket> {
  const enrollmentFromUser = await getEnrollmentFromUserByUserId(userId);

  if (!enrollmentFromUser) throw notFoundError();

  const createdTicket = await ticketRepository.createTicket({ enrollmentId: enrollmentFromUser.id, ticketTypeId });

  return createdTicket;
}

function getEnrollmentFromUserByUserId(userId: number): Promise<getEnrollmentFromUserByUserIdResult> {
  return enrollmentRepository.findWithAddressByUserId(userId);
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
