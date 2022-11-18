import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getTicketTypes, getTicketsFromUser, postTicket } from "@/controllers";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", getTicketTypes)
  .get("/", getTicketsFromUser)
  .post("/", postTicket);

export { ticketsRouter };
