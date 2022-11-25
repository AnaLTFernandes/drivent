import { Hotel, Room, TicketStatus } from "@prisma/client";
import { notFoundError, unauthorizedError } from "@/errors";
import { paymentRequiredError } from "./errors";
import hotelRepository from "@/repositories/hotel-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getHotels(userId: number): Promise<GetHotelsResult[]> {
  await validateUserTicketOrFail(userId);
  const hotelsResult = await hotelRepository.findHotels();

  const hotels: GetHotelsResult[] = [];
  const RoomsData = { maxRoomCapacity: 1, totalVacancies: 0, vacanciesReserved: 0 };

  hotelsResult.forEach((hotel) => {
    hotel.Rooms.forEach(({ capacity, _count: { Booking: bookings } }) => {
      if (RoomsData.maxRoomCapacity < capacity) {
        RoomsData.maxRoomCapacity = capacity;
      }

      RoomsData.totalVacancies += capacity;
      RoomsData.vacanciesReserved += bookings;
    });

    hotels.push({
      id: hotel.id,
      name: hotel.name,
      image: hotel.image,
      maxRoomCapacity: RoomsData.maxRoomCapacity,
      availableVacancies: RoomsData.totalVacancies - RoomsData.vacanciesReserved,
    });
  });

  return hotels;
}

export type GetHotelsResult = Omit<Hotel, "createdAt" | "updatedAt"> & {
  maxRoomCapacity: number;
  availableVacancies: number;
};

async function getRoomsFromHotel(hotelId: number, userId: number): Promise<GetRoomsFromHotelResult[]> {
  await validateUserTicketOrFail(userId);

  const roomsResult = await hotelRepository.findRoomsFromHotel(hotelId);

  if (roomsResult.length === 0) throw notFoundError();

  const rooms = roomsResult.map(({ id, name, capacity, _count, Hotel }) => ({
    id,
    name,
    capacity,
    bookeds: _count.Booking,
    hotelName: Hotel.name,
    hotelImage: Hotel.image,
  }));

  return rooms;
}

export type GetRoomsFromHotelResult = Omit<Room, "hotelId" | "createdAt" | "updatedAt"> & {
  bookeds: number;
  hotelName: string;
  hotelImage: string;
};

async function validateUserTicketOrFail(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) throw unauthorizedError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket) throw unauthorizedError();

  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) throw unauthorizedError();

  if (ticket.status !== TicketStatus.PAID) throw paymentRequiredError();
}

const hotelsService = {
  getHotels,
  getRoomsFromHotel,
};

export default hotelsService;
