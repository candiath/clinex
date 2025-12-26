import * as z from "zod";
import { DoctorSpecialty } from "../types/doctorSpecialty.type";

export const EntityIDSchema = z.coerce.number().int().positive().nonoptional();
export const EmailSchema = z.email().nonoptional();
export const MedicalSpecialtySchema = z.enum(DoctorSpecialty).nonoptional();
export const FutureDateSchema = z.coerce.date().nonoptional();
export const PhoneSchema = z.string().trim().regex(/^[0-9+()\-\s]{7,20}$/, "Invalid phone number");
export const NameSchema = z.string().min(1).nonoptional();
export const BirthDateSchema = z.coerce.date().max(new Date()).nonoptional();
export const DniSchema = z.coerce
  .number()
  .int()
  .positive()
  .min(1_000_000)
  .max(99_999_999)
  .nonoptional()
  .transform((val) => val.toString());
export const SexSchema = z.enum(["male", "female", "other", "prefer not to say"]).nonoptional();
export const AppointmentStatusSchema = z.enum(["scheduled", "completed", "canceled"]).nonoptional();

export const AppointmentDataSchema = z.object({
  date: FutureDateSchema,
  status: AppointmentStatusSchema,
  doctorId: EntityIDSchema,
  patientId: EntityIDSchema,
});

export const DoctorDataSchema = z.strictObject({
  name: NameSchema,
  specialty: MedicalSpecialtySchema,
  email: EmailSchema,
  phone: PhoneSchema,
});

export const PatientDataSchema = z.strictObject({
  dni: DniSchema,
  firstName: NameSchema,
  lastName: NameSchema,
  email: EmailSchema.optional(),
  phone: PhoneSchema.optional(),
  birthDate: BirthDateSchema,
  sex: SexSchema,
});

export const AppointmentDTOSchema = AppointmentDataSchema.partial();
export const DoctorDTOSchema = DoctorDataSchema.partial();
export const PatientDTOSchema = PatientDataSchema.partial();

/*
status: z.coerce
    .string()
    .refine((val) => AppointmentStatus.includes(val), {
      message: "Invalid appointment status",
    })
    .optional(),
*/
