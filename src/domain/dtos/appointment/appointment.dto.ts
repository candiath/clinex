import { CustomError } from "../../errors/customError";
import { AppointmentStatus } from "../../valueObjects/appointmentStatus";
import * as z from "zod";

const AppointmentDTOSchema = z.object({
  patientID: z.coerce.number().int().positive().optional(),
  doctorID: z.coerce.number().int().positive().optional(),
  dateTime: z.coerce.date().optional(),
  status: z.coerce
    .string()
    .refine((val) => AppointmentStatus.includes(val), {
      message: "Invalid appointment status",
    })
    .optional(),
  id: z.coerce.number().int().positive().optional(),
});

const IDSchema = z.coerce.number().int().positive().nonoptional();
export class AppointmentDTO {
  private constructor(
    public patientId: number | undefined,
    public doctorId: number | undefined,
    public dateTime: Date | undefined,
    public status: AppointmentStatus | undefined,
    public id?: number
  ) {}

  public static validate(data: {
    [key: string]: string;
  }): [string | null, AppointmentDTO | null] {
    const parsingResult = AppointmentDTOSchema.safeParse(data);
    const dto = new AppointmentDTO(
      parsingResult.data?.patientID,
      parsingResult.data?.doctorID,
      parsingResult.data?.dateTime,
      parsingResult.data?.status
        ? AppointmentStatus.create(parsingResult.data?.status)
        : undefined,
      parsingResult.data?.id
    );

    return [null, dto];
  }

  public static validateID(data: any): number {
    const parsingResult = IDSchema.safeParse(data);
    if (parsingResult.data) return parsingResult.data;
    throw CustomError.badRequest("Error validating appointment ID", {
      location: "appointment.dto",
    });
  }

  // Helper para verificar propiedades de forma segura
  private static hasProp(obj: any, prop: string): boolean {
    return obj != null && Object.prototype.hasOwnProperty.call(obj, prop);
  }
}
