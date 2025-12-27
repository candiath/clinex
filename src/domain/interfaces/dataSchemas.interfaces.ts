import * as z from "zod";
import { DoctorSpecialty } from "../types/doctorSpecialty.type";

export const EntityIDSchema = z.coerce
  .number()
  .int()
  .positive("ID should be greater than 0")
  .nonoptional();
export const EmailSchema = z.email("Missing or invalid email").nonoptional();
export const MedicalSpecialtySchema = z.enum(DoctorSpecialty).nonoptional();
export const FutureDateSchema = z.coerce
  .date("Date cannot be in the past")
  .nonoptional();
export const PhoneSchema = z
  .string("Phone is required or was provided in a wrong format")
  .trim()
  .regex(/^[0-9+()\-\s]{7,20}$/, "Invalid phone number");
export const NameSchema = z
  .string("Name is required")
  .min(3, "Name is too short")
  .nonoptional();
export const BirthDateSchema = z.coerce
  .date("Invalid birth date")
  .max(new Date(), "Birth date cannot be in the future")
  .nonoptional();
export const DniSchema = z.coerce
  .number()
  .int()
  .positive()
  .min(1_000_000)
  .max(99_999_999)
  .nonoptional()
  .transform((val) => val.toString());
export const SexSchema = z
  .enum(["male", "female", "other", "prefer not to say"])
  .nonoptional();
export const AppointmentStatusSchema = z
  .enum([
    "SCHEDULED",
    "CONFIRMED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
    "NO_SHOW",
  ])
  .nonoptional();

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
