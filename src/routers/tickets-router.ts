import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getTicketTypes, getTicketsFromUser } from "@/controllers/tickets-controller";

const ticketsRouter = Router();

ticketsRouter.all("/*", authenticateToken).get("/types", getTicketTypes).get("/", getTicketsFromUser);

export { ticketsRouter };
