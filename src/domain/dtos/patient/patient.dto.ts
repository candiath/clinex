import { CustomError } from "../../errors/customError";
import * as z from "zod";

const PatientDTOSchema = z.object({
  dni: z.string().regex(/^\d+$/, "El DNI debe contener solo números"),
  firstName: z.string(),
  lastName: z.string(),
  birthDate: z.coerce.date(),
  email: z.email().optional(),
  sex: z.nativeEnum({ male: "male", female: "female" }),
  id: z.coerce.number().int().positive().optional(),
})

const IDSchema = z.coerce.number().int().positive().nonoptional();
export class PatientDTO {
  private constructor(
    public dni: string | undefined,
    public firstName: string | undefined,
    public lastName: string | undefined,
    public birthDate: Date | undefined,
    public email: string | undefined,
    public sex: string | undefined,
    public id?: number | undefined,
  ) { }


  public static validate(data: { [key: string]: string }): [string | null, PatientDTO | null] {
    if (!data || typeof data !== 'object' && Array.isArray(data) || Object.keys(data).length === 0) {
      return ['PatientDTO no data provided or wrong format', null];
    }

    let parsedData;
    try {
      parsedData = PatientDTOSchema.parse(data);
      console.log({ parsedData });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = z.prettifyError(error);
        throw CustomError.badRequest(`Validation errors: \n${messages}`);
      }
      // TODO: en lugar de simplemente tirar el error, podría tirar un 
      // CustomError.unhanldedException o algo por el estilo que indique
      // donde pingo ocurrió el error para depurar mas rapidamente los 
      // casos en los que la explosión viene por otro lado XD
      throw error;
    }
    return [null, new PatientDTO(
      parsedData.dni ?? undefined,
      parsedData.firstName ?? undefined,
      parsedData.lastName ?? undefined,
      parsedData.birthDate ?? undefined,
      parsedData.email ?? undefined,
      parsedData.sex ?? undefined,
      parsedData.id ?? undefined

    )]
  }

  public static validateID(id: string): number {
    let parsedID;
    try {
      parsedID = IDSchema.parse(id);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = z.prettifyError((error as z.ZodError));
        throw CustomError.badRequest(`Validation errors:\n${messages}`);
      }
      throw error;
      // return [ error, null ];
    }
    return parsedID
  }
}