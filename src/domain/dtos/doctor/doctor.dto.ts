import * as z from "zod";
import { CustomError } from "../../errors/customError";
import { DoctorInterface } from "../../interfaces/doctor.interfaces";
import {
  EntityIDSchema,
  DoctorDTOSchema,
} from "../../interfaces/dataSchemas.interfaces";
import { EntityID } from "../../valueObjects/entityID";

export const validate = (data: { [key: string]: string }): DoctorInterface => {
  if (!data || typeof data != "object") {
    throw CustomError.badRequest("DoctorDTO no data provided or wrong format", {
      location: "doctor.dto.ts: validate",
    });
  }

  let parsedData;
  try {
    parsedData = DoctorDTOSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = z.prettifyError(error as z.ZodError);
      throw CustomError.badRequest(`Validation errors:\n${messages}`, {
        location: "doctor.dto.ts: validate",
      });
    }
    throw error;
  }
  return parsedData as unknown as DoctorInterface;
};

export const validateID = (id: unknown): EntityID | undefined => {
  let parsedID;
  try {
    parsedID = EntityIDSchema.parse(id);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = z.prettifyError(error as z.ZodError);
      throw CustomError.badRequest(`Validation errors:\n${messages}`, {
        location: "doctor.dto.ts: validateID",
      });
    }
    throw error;
  }
  return EntityID.validate(parsedID);
};
