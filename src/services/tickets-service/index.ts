import ticketRepository from "@/repositories/ticket-repository";
import { TicketType } from "@prisma/client";

async function getTicketTypes(): Promise<TicketType[]> {
  const types = await ticketRepository.findTypes();

  return types;
}

const ticketsService = {
  getTicketTypes,
};

export default ticketsService;
