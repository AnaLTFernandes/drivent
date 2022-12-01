import { Hotel, Room, TicketStatus } from "@prisma/client";
import { notFoundError } from "@/errors";
import { forbiddenError } from "./errors";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotel-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getBooking(userId: number): Promise<GetBookingResult> {
  const bookingResult = await bookingRepository.findBookingByUserId(userId);

  if (!bookingResult) throw notFoundError();

  const booking = {
    bookingId: bookingResult.id,
    hotel: bookingResult.Room.Hotel,
    room: {
      id: bookingResult.Room.id,
      name: bookingResult.Room.name,
      capacity: bookingResult.Room.capacity,
      hotelId: bookingResult.Room.hotelId,
      bookeds: bookingResult.Room._count.Booking,
    },
  };

  return booking;
}

type GetBookingResult = {
  bookingId: number;
  hotel: Omit<Hotel, "createdAt" | "updatedAt">;
  room: Omit<Room, "createdAt" | "updatedAt"> & { bookeds: number };
};

async function postBooking({ userId, roomId }: CreateBookingParams): Promise<PostBookingResult> {
  await validateUserEnrollmentAndTicketOrFail(userId);

  const userBooking = await bookingRepository.findBookingByUserId(userId);

  if (userBooking) throw forbiddenError();

  const room = await hotelRepository.findRoomById(roomId);

  if (!room) throw notFoundError();

  if (room.capacity <= room.Booking.length) throw forbiddenError();

  const booking = await bookingRepository.createBooking(roomId, userId);

  return { bookingId: booking.id };
}

type PostBookingResult = { bookingId: number };

async function putBooking({ userId, roomId, bookingId }: UpdateBookingParams): Promise<PutBookingResult> {
  await validateUserEnrollmentAndTicketOrFail(userId);

  const userBooking = await bookingRepository.findBookingByUserId(userId);

  if (!userBooking || userBooking.id !== bookingId || userBooking.Room.id === roomId) throw forbiddenError();

  const room = await hotelRepository.findRoomById(roomId);

  if (!room) throw notFoundError();

  if (room.capacity <= room.Booking.length) throw forbiddenError();

  const booking = await bookingRepository.updateBooking(bookingId, roomId);

  return { bookingId: booking.id };
}

type PutBookingResult = { bookingId: number };

async function validateUserEnrollmentAndTicketOrFail(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) throw forbiddenError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (
    !ticket ||
    !ticket.TicketType.includesHotel ||
    ticket.TicketType.isRemote ||
    ticket.status !== TicketStatus.PAID
  ) {
    throw forbiddenError();
  }
}

export type CreateBookingParams = { roomId: number; userId: number };
export type UpdateBookingParams = CreateBookingParams & { bookingId: number };

const bookingsService = {
  getBooking,
  postBooking,
  putBooking,
};

export default bookingsService;
