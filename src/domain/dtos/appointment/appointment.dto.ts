import * as z from "zod";
import { CustomError } from "../../errors/customError";
import { AppointmentDTOSchema } from "../../interfaces/dataSchemas.interfaces";
import { AppointmentInterface } from "../../interfaces/appointment.interfaces";

export const validate = (data: {
  [key: string]: string;
}): AppointmentInterface => {
  const parsingResult = AppointmentDTOSchema.safeParse(data);
  if (!parsingResult.success) {
    const messages = z.prettifyError(parsingResult.error);
    throw CustomError.badRequest(`Validation errors:\n${messages}`, {
      location: "appointment.dto.ts: validate",
    });
  }
  const dto = parsingResult.data as unknown as AppointmentInterface;

  return dto;
};