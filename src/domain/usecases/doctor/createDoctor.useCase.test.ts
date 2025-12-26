import { CreateDoctorUseCase } from "./createDoctor.useCase";
import { DoctorRepositoryImplementation } from "../../../infrastructure/repositories/doctor.repository.implementation";
import { DoctorDatasource } from "../../datasources/doctor.datasource";
import { Doctor } from "../../entities/doctor.entity";
import { CustomError } from "../../errors/customError";
import { ValidationHelper } from "../../helpers/validation.helper";
import * as DoctorDTO from "../../dtos/doctor/doctor.dto";
import { DoctorSpecialty } from "../../types/doctorSpecialty.type";
import { EntityID } from "../../valueObjects/entityID";
import { DoctorInterface } from "../../interfaces/doctor.interfaces";

jest.mock(
  "../../../infrastructure/repositories/doctor.repository.implementation"
);

jest.mock("../../helpers/validation.helper");

describe("Create doctor use case", () => {
  let createDoctorUseCase: CreateDoctorUseCase;
  let mockRepository: jest.Mocked<DoctorRepositoryImplementation>;
  let mockDatasource: jest.Mocked<DoctorDatasource>;

  const mockValidationHelper = ValidationHelper as jest.Mocked<
    typeof ValidationHelper
  >;

  // const mockDoctorDTO = validate as jest.MockedFunction<typeof validate>;

  // Test constraints
  // Usa el tipo DoctorSpecialty para specialty
  const VALID_DOCTOR_DATA = {
    name: "Dr. Test",
    specialty: "CARDIOLOGY" as DoctorSpecialty,
    email: "dr.test@example.com",
    phone: "123-456-7890",
  };

  // Helper para crear instancia Doctor esperada
  const createExpectedDoctor = (
    data: typeof VALID_DOCTOR_DATA & { id?: string }
  ) => {
    return Doctor.create(
      data.name,
      data.specialty,
      data.email,
      data.phone,
      EntityID.createOptional(data.id) || undefined
    );
  };

  // Helper para probar errores de validación
  const testValidationError = async (
    invalidData: any,
    expectedMessage: string
  ) => {
    await expect(
      createDoctorUseCase.execute(invalidData as any)
    ).rejects.toThrow(expectedMessage);
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockDatasource = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
      emailExists: jest.fn(),
    } as jest.Mocked<DoctorDatasource>;

    mockRepository = new DoctorRepositoryImplementation(
      mockDatasource
    ) as jest.Mocked<DoctorRepositoryImplementation>;
    mockRepository.save = jest.fn();

    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();

    // mockValidationHelper
    mockValidationHelper.isValidMedicalSpecialty.mockReturnValue(true);
    mockValidationHelper.validateEmail.mockReturnValue(null);
    createDoctorUseCase = new CreateDoctorUseCase(mockRepository);

    jest.spyOn(DoctorDTO, "validate").mockImplementation((data: any) => {
      // Simula validación real: lanza CustomError si falta algún campo requerido
      if (!data || typeof data !== "object") {
        throw CustomError.badRequest(
          "DoctorDTO no data provided or wrong format"
        );
      }
      const requiredFields = ["name", "specialty", "email", "phone"];
      for (const field of requiredFields) {
        if (data[field] == null || data[field] === "") {
          throw CustomError.badRequest(`Doctor ${field} is required`);
        }
      }
      // Simula validación de formato de email y teléfono si es necesario en tests específicos
      return Doctor.create(
        data.name,
        data.specialty,
        data.email,
        data.phone,
        data.id || undefined
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("Successful doctor creation", () => {
    it("Should create a doctor successfully with all required data", async () => {
      const expectedDoctor = createExpectedDoctor(VALID_DOCTOR_DATA);
      mockRepository.save.mockResolvedValue(expectedDoctor);

      const result = await createDoctorUseCase.execute(VALID_DOCTOR_DATA);

      expect(result).toBeInstanceOf(Doctor);
      expect(result!.name).toBe(expectedDoctor.name);
      expect(result!.specialty).toBe(expectedDoctor.specialty);
      expect(result!.email).toBe(expectedDoctor.email);
      expect(result!.phone).toBe(expectedDoctor.phone);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedDoctor);
    });
  });

  describe("Validation errors", () => {
    it("Should throw error when name is missing", async () => {
      const doctorWithoutName = { ...VALID_DOCTOR_DATA };
      delete (doctorWithoutName as any).name;
      await expect(
        createDoctorUseCase.execute(doctorWithoutName as any)
      ).rejects.toThrow("Name is required");
    });

    it("Should throw error when specialty is missing", async () => {
      const doctorWithoutSpecialty = { ...VALID_DOCTOR_DATA };
      delete (doctorWithoutSpecialty as any).specialty;
      await expect(
        createDoctorUseCase.execute(doctorWithoutSpecialty as any)
      ).rejects.toThrow("Invalid option: expected one of");
    });

    it("Should throw error when email is missing", async () => {
      const doctorWithoutEmail = { ...VALID_DOCTOR_DATA };
      delete (doctorWithoutEmail as any).email;
      await expect(
        createDoctorUseCase.execute(doctorWithoutEmail as any)
      ).rejects.toThrow("Missing or invalid email");
    });

    it("Should throw error when phone is missing", async () => {
      const doctorWithoutPhone = { ...VALID_DOCTOR_DATA };
      delete (doctorWithoutPhone as any).phone;
      await expect(
        createDoctorUseCase.execute(doctorWithoutPhone as any)
      ).rejects.toThrow("Phone is required or was provided in a wrong format");
    });

    it("Should throw error when data is completely invalid", async () => {
      await expect(createDoctorUseCase.execute({} as any)).rejects.toThrow(
        "Name is required"
      );
    });

    it("Should throw error when email format is invalid", async () => {
      // Simula que el mock de validate lanza error de formato de email
      const invalidEmailData = {
        ...VALID_DOCTOR_DATA,
        email: "invalid-email-format",
      };
      // jest.spyOn(require("../../dtos/doctor/doctor.dto"), "validate").mockImplementation(() => {
      //   throw CustomError.badRequest("Invalid email format");
      // });
      await expect(
        createDoctorUseCase.execute(invalidEmailData as any)
      ).rejects.toThrow("Missing or invalid email");
    });

    it("Should throw error when phone format is invalid", async () => {
      // Simula que el mock de validate lanza error de formato de teléfono
      const invalidPhoneData = {
        ...VALID_DOCTOR_DATA,
        phone: "invalid-phone-format",
      };
      // jest.spyOn(require("../../dtos/doctor/doctor.dto"), "validate").mockImplementation(() => {
      //   throw CustomError.badRequest("Phone format is invalid");
      // });
      await expect(
        createDoctorUseCase.execute(invalidPhoneData as any)
      ).rejects.toThrow("Invalid phone number");
    });
  });

  describe("Repository errors", () => {
    it("Should throw internal server error when repository save fails", async () => {
      mockRepository.save.mockRejectedValue(
        CustomError.internalServerError("Internal server error")
      );
      await expect(
        createDoctorUseCase.execute(VALID_DOCTOR_DATA)
      ).rejects.toThrow("Internal server error");
    });

    it("Should handle null values as missing", async () => {
      const doctorWithNullValues = {
        ...VALID_DOCTOR_DATA,
        name: null,
        specialty: null,
        email: null,
        phone: null,
      };

      expect.assertions(4);
      
      try {
        await createDoctorUseCase.execute(
          doctorWithNullValues as unknown as DoctorInterface
        );
        fail("Expect to throw");
      } catch (error) {
        expect((error as CustomError).message).toContain("Name is required");
        expect((error as CustomError).message).toContain(
          "Invalid option: expected one of"
        );
        expect((error as CustomError).message).toContain(
          "Missing or invalid email"
        );
        expect((error as CustomError).message).toContain(
          "Phone is required or was provided in a wrong format"
        );
      }
    });

    it("Should handle undefined values as missing", async () => {
      const doctorWithUndefinedValues = {
        ...VALID_DOCTOR_DATA,
        name: undefined,
        specialty: undefined,
        email: undefined,
        phone: undefined,
      };

      expect.assertions(4);

      try {
        await createDoctorUseCase.execute(
          doctorWithUndefinedValues as unknown as DoctorInterface
        );
        fail("Expect to throw");
      } catch (error) {
        expect((error as CustomError).message).toContain("Name is required");
        expect((error as CustomError).message).toContain(
          "Invalid option: expected one of"
        );
        expect((error as CustomError).message).toContain(
          "Missing or invalid email"
        );
        expect((error as CustomError).message).toContain(
          "Phone is required or was provided in a wrong format"
        );
      }
    });
  });
});
