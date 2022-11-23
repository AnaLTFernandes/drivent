import { Hotel, Room } from "@prisma/client";
import { notFoundError } from "@/errors";
import hotelRepository from "@/repositories/hotel-repository";

async function getHotels(): Promise<GetHotelsResult[]> {
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

async function getRoomsFromHotel(hotelId: number): Promise<GetRoomsFromHotelResult[]> {
  const hotel = await hotelRepository.findHotelById(hotelId);

  if (!hotel) throw notFoundError();

  const roomsResult = await hotelRepository.findRoomsFromHotel(hotelId);

  const rooms = roomsResult.map(({ id, name, capacity, _count }) => ({ id, name, capacity, bookeds: _count.Booking }));

  return rooms;
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
