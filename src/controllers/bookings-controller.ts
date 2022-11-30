import { Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";
import bookingsService from "@/services/bookings-service";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const booking = await bookingsService.getBooking(userId);

    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;

  if (!roomId || typeof roomId !== "number") {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const createdBooking = await bookingsService.postBooking(userId, roomId);

    return res.status(httpStatus.OK).send(createdBooking);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}
