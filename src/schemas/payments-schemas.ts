import Joi from "joi";
import { CreatePayment } from "@/services";

export const createPaymentSchema = Joi.object<CreatePayment>({
  ticketId: Joi.number().min(1).required(),
  cardData: Joi.object({
    issuer: Joi.string().required(),
    number: Joi.string().required(),
    name: Joi.string().required(),
    expirationDate: Joi.string().required(),
    cvv: Joi.string().required(),
  }).required(),
});
