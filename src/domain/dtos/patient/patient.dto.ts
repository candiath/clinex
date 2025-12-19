import { CustomError } from "../../errors/customError";
import * as z from "zod";
import { PatientInterface } from "../../interfaces/patient.interfaces";
import {
  EntityIDSchema,
  PatientDTOSchema,
} from "../../interfaces/dataSchemas.interfaces";

export const validate = (data: { [key: string]: string }): PatientInterface => {
  if (!data || Object.keys(data).length === 0)
  throw CustomError.badRequest("No data provided or wrong format", {
    location: "patient.dto.ts: validate",
  });

  let parsedData;
  try {
    parsedData = PatientDTOSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = z.prettifyError(error);
      throw CustomError.badRequest(`Validation errors: \n${messages}`, {
        location: "patient.dto.ts: validate",
      });
    }
    throw error;
  }
  return {
      dni: parsedData.dni ?? undefined,
      firstName: parsedData.firstName ?? undefined,
      lastName: parsedData.lastName ?? undefined,
      birthDate: parsedData.birthDate ?? undefined,
      email: parsedData.email ?? undefined,
      sex: parsedData.sex ?? undefined,
    } as unknown as PatientInterface;
};

export const validateID = (id: string): number => {
  let parsedID;
  try {
    parsedID = EntityIDSchema.parse(id);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = z.prettifyError(error as z.ZodError);
      throw CustomError.badRequest(`Validation errors:\n${messages}`);
    }
    throw error;
    // return [ error, null ];
  }
  return parsedID;
};
