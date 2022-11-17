import { prisma } from "@/config";

async function findTypes() {
  return prisma.ticketType.findMany();
}

const ticketRepository = {
  findTypes,
};

export default ticketRepository;
