import hotelRepository from "@/repositories/hotel-repository";
import { Hotel } from "@prisma/client";

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

export type GetHotelsResult = Omit<Hotel, "createdAt" | "updatedAt"> & {
  maxCapacityPerRoom: number;
  availableVacancies: number;
};

const hotelsService = {
  getHotels,
};

export default hotelsService;
