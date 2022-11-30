import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";

async function getBooking(userId: number) {
  const bookingResult = await bookingRepository.findBooking(userId);

  if (!bookingResult) throw notFoundError();

  const booking = {
    bookingId: bookingResult.id,
    bookeds: bookingResult.Room._count.Booking,
    hotel: bookingResult.Room.Hotel,
    room: {
      id: bookingResult.Room.id,
      name: bookingResult.Room.name,
      capacity: bookingResult.Room.capacity,
      hotelId: bookingResult.Room.hotelId,
    },
  };

  return booking;
}

const bookingsService = {
  getBooking,
};

export default bookingsService;
