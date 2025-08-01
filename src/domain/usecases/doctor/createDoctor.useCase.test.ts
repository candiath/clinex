import { CreateDoctorUseCase } from "./createDoctor.useCase";
import { DoctorRepositoryImplementation } from "../../../infrastructure/repositories/doctor.repository.implementation";
import { DoctorMySQLDatasource } from "../../../infrastructure/datasources/MySQL/doctor.datasource.implementation";
import { DoctorDatasource } from "../../datasources/doctor.datasource";
import { after } from "node:test";
import { Doctor } from "../../entities/doctor.entity";
import { CustomError } from "../../errors/customError";
import { ValidationHelper } from "../../helpers/validation.helper";
import { DoctorDTO } from "../../dtos/doctor/doctor.dto";

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

  const mockDoctorDTO = DoctorDTO as jest.Mocked<typeof DoctorDTO>;

  // Test constraints
  const VALID_DOCTOR_DATA = {
    name: "Dr. Test",
    specialty: "CARDIOLOGY",
    email: "dr.test@example.com",
    phone: "123-456-7890",
  };

  // Helper function to create expected Doctor instance
  const createExpectedDoctor = (data: any) => {
    return Doctor.create(
      data.name,
      data.specialty,
      data.email,
      data.phone,
      data.id || undefined // ID is optional
    );
  };

  // Helper function to test validation errors
  const testValidationError = async (
    invalidData: any,
    expectedMessage: string
  ) => {
    await expect(createDoctorUseCase.execute(invalidData)).rejects.toThrow(
      expectedMessage
    );
  };

  // Helper function to test missing field errors
  const testMissingFieldError = async (
    baseData: any,
    fieldToRemove: string,
    expectedErrorMessage: string
  ) => {
    const invalidData = { ...baseData };
    delete invalidData[fieldToRemove];

    await testValidationError(invalidData, expectedErrorMessage);
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
    mockValidationHelper.validatePhone.mockReturnValue(null);

    createDoctorUseCase = new CreateDoctorUseCase(mockRepository);

    jest.spyOn(DoctorDTO, "validate").mockImplementation((data) => {
      // Simula validación exitosa por defecto
      if (!data || typeof data !== "object") {
        return ["DoctorDTO mock: no data provided or wrong format", null];
      }

      return [
        null,
        Doctor.create(
          data.name,
          data.specialty,
          data.email,
          data.phone,
          data.id || undefined
        ),
      ];
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("Successful doctor creation", () => {
    it("Should create a doctor successfully with all required data", async () => {
      const expectedDoctor = createExpectedDoctor(VALID_DOCTOR_DATA);
      (DoctorDTO.validate as jest.Mock).mockReturnValue([null, expectedDoctor]);
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
      const { name, ...doctorWithoutName } = VALID_DOCTOR_DATA;

      try {
        await createDoctorUseCase.execute(doctorWithoutName);
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).statusCode).toBe(400);
        expect((error as CustomError).message).toBe("Doctor name is required");
      }
    });

    it("Should throw error when specialty is missing", async () => {
      const { specialty, ...doctorWithoutSpecialty } = VALID_DOCTOR_DATA;

      try {
        await createDoctorUseCase.execute(doctorWithoutSpecialty);
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).statusCode).toBe(400);
        expect((error as CustomError).message).toBe(
          "Doctor specialty is required"
        );
      }
    });

    it("Should throw error when email is missing", async () => {
      const { email, ...doctorWithoutEmail } = VALID_DOCTOR_DATA;
      try {
        await createDoctorUseCase.execute(doctorWithoutEmail);
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).statusCode).toBe(400);
        expect((error as CustomError).message).toBe("Doctor email is required");
      }
    });

    it("Should throw error when phone is missing", async () => {
      const { phone, ...doctorWithoutPhone } = VALID_DOCTOR_DATA;
      try {
        await createDoctorUseCase.execute(doctorWithoutPhone);
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).statusCode).toBe(400);
        expect((error as CustomError).message).toBe("Doctor phone is required");
      }
    });

    it("Should throw error when data is completely invalid", async () => {
      // await testValidationError({}, "Doctor name is required");
      try {
        await createDoctorUseCase.execute({});
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).message).toBe("Doctor name is required");
        expect((error as CustomError).statusCode).toBe(400);
      }
    });

    // test.todo("Should throw error when email format is invalid");
    it("Should throw error when email format is invalid", async () => {
      const invalidEmailData = {
        ...VALID_DOCTOR_DATA,
        email: "invalid-email-format",
      };

      (mockDoctorDTO.validate as jest.Mock).mockReturnValue([
        "Invalid email format",
        null,
      ]);

      try {
        await createDoctorUseCase.execute(invalidEmailData);
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).statusCode).toBe(400);
      }
    });

    // test.todo("Should throw error when phone format is invalid");
    it("Should throw error when phone format is invalid", async () => {
      const invalidPhoneData = {
        ...VALID_DOCTOR_DATA,
        phone: "invalid-phone-format",
      };

      (mockDoctorDTO.validate as jest.Mock).mockReturnValue([
        "Phone format is invalid",
      ]);
      try {
        await createDoctorUseCase.execute(invalidPhoneData);
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).statusCode).toBe(400);
      }
    });
  });

  describe("Repository errors", () => {
    it("Should throw internal server error when repository save fails", () => {
      mockRepository.save.mockRejectedValue(
        new CustomError(500, "Internal server error")
      );

      return expect(
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

      await expect(
        createDoctorUseCase.execute(doctorWithNullValues)
      ).rejects.toThrow("Doctor name is required");
    });

    it("Should handle undefined values as missing", async () => {
      const doctorWithUndefinedValues = {
        ...VALID_DOCTOR_DATA,
        name: undefined,
        specialty: undefined,
        email: undefined,
        phone: undefined,
      };

      await expect(
        createDoctorUseCase.execute(doctorWithUndefinedValues)
      ).rejects.toThrow("Doctor name is required");
    });
  });
});
