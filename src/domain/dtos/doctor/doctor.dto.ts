import { DoctorSpecialty } from "../../types/doctorSpecialty.type";
import { CustomError } from "../../errors/customError";
import * as z from "zod";


const DoctorDTOSchema = z.looseObject({
  name: z.string().nullish(),
  specialty: z.nativeEnum(DoctorSpecialty).nullish(),
  email: z.email().nullish(),
  phone: z.string().nullish(),
  id: z.coerce.number().int().positive().optional(),
});


export class DoctorDTO {
  private constructor(
    public name: string | undefined,
    public specialty: DoctorSpecialty | undefined,
    public email: string | undefined,
    public phone: string | undefined,
    public id?: number | undefined
  ) { }

  public static validate(data: {
    [key: string]: string;
  }): [string | null, DoctorDTO | null] {
    if (!data || typeof data != "object") {
      return ["DoctorDTO no data provided or wrong format", null];
    }

    let parsedData;
    try {
      parsedData = DoctorDTOSchema.parse(data);
      console.log({"parseddata": parsedData});
    } catch (error) {
      if (error instanceof z.ZodError) {
        // const messages = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('\n');
        const messages = z.prettifyError((error as z.ZodError));
        throw CustomError.badRequest(`Validation errors:\n${messages}`);
      }
      throw error;
    }
    return [
      null,
      new DoctorDTO(
        parsedData!.name ?? undefined,
        parsedData!.specialty ?? undefined,
        parsedData!.email ?? undefined,
        parsedData!.phone ?? undefined,
        parsedData.id ?? undefined
      ),
    ];
  }
}
