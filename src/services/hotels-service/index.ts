import { Hotel, Room, TicketStatus } from "@prisma/client";
import { notFoundError, unauthorizedError } from "@/errors";
import hotelRepository from "@/repositories/hotel-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { paymentRequiredError } from "./errors";

async function getHotels(userId: number): Promise<GetHotelsResult[]> {
  await validateUserTicketOrFail(userId);
  const hotelsResult = await hotelRepository.findHotels();

  const RoomsData = { maxCapacityPerRoom: 1, totalVacancies: 0, vacanciesReserved: 0 };
  const hotels: GetHotelsResult[] = [];

  hotelsResult.forEach((hotel) => {
    hotel.Rooms.forEach(({ capacity, _count: { Booking: bookings } }) => {
      if (RoomsData.maxCapacityPerRoom < capacity) {
        RoomsData.maxCapacityPerRoom = capacity;
      }

      RoomsData.totalVacancies += capacity;
      RoomsData.vacanciesReserved = bookings;
    });

    hotels.push({
      id: hotel.id,
      name: hotel.name,
      image: hotel.image,
      maxCapacityPerRoom: RoomsData.maxCapacityPerRoom,
      availableVacancies: RoomsData.totalVacancies - RoomsData.vacanciesReserved,
    });
  });

  return hotels;
}

async function getRoomsFromHotel(hotelId: number, userId: number): Promise<GetRoomsFromHotelResult[]> {
  await validateUserTicketOrFail(userId);

  const hotel = await hotelRepository.findHotelById(hotelId);

  if (!hotel) throw notFoundError();

  const roomsResult = await hotelRepository.findRoomsFromHotel(hotelId);

  const rooms = roomsResult.map(({ id, name, capacity, _count }) => ({ id, name, capacity, bookeds: _count.Booking }));

  return rooms;
}

async function validateUserTicketOrFail(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) throw paymentRequiredError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket) throw paymentRequiredError();

  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) throw unauthorizedError();

  if (ticket.status !== TicketStatus.PAID) throw paymentRequiredError();

  return;
}

export type GetHotelsResult = Omit<Hotel, "createdAt" | "updatedAt"> & {
  maxCapacityPerRoom: number;
  availableVacancies: number;
};

export type GetRoomsFromHotelResult = Omit<Room, "hotelId" | "createdAt" | "updatedAt"> & {
  bookeds: number;
};

const hotelsService = {
  getHotels,
  getRoomsFromHotel,
};

export default hotelsService;
