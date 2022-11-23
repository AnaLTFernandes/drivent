import { Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const hotels = await hotelsService.getHotels();

    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}

export async function getRoomsFromHotel(req: AuthenticatedRequest, res: Response) {
  const hotelId = Number(req.params.id) || null;

  if (!hotelId) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    const rooms = await hotelsService.getRoomsFromHotel(hotelId);

    return res.status(httpStatus.OK).send(rooms);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}
