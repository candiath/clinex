import { ValidationHelper } from "../../helpers/validation.helper";
import { DoctorDTO } from "./doctor.dto";

jest.mock("../../helpers/validation.helper");

describe("DoctorDTO", () => {
  // let mockValidationHelper: jest.Mocked<ValidationHelper>;

  const mockValidationHelper = ValidationHelper as jest.Mocked<
    typeof ValidationHelper
  >;

  const VALID_DOCTOR_DATA = {
    name: "Test name",
    specialty: "CARDIOLOGY",
    email: "test@clinex.com",
    phone: "112345123456",
  };

  const VALID_DOCTOR_DATA_WITH_ID = {
    ...VALID_DOCTOR_DATA,
    id: "12345678",
  };

  // Helper function to test validation errors
  const testValidationError = async (
    invalidData: any,
    expectedMessage: string
  ) => {
    await expect(DoctorDTO.validate(invalidData)).rejects.toThrow(
      expectedMessage
    );
  };

  beforeEach(() => {
    // Mock console methods to avoid noise in test output
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();

    mockValidationHelper.isValidMedicalSpecialty.mockReturnValue(true);
    mockValidationHelper.validateEmail.mockReturnValue(null);
    mockValidationHelper.validatePhone.mockReturnValue(null);
  });

  afterEach(() => {
    // Restore console methods
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  // Helper function to test missing field errors
  const testMissingFieldError = async (
    baseData: any,
    fieldToRemove: string,
    expectedErrorMessage: any
  ) => {
    const invalidData = { ...baseData };
    delete invalidData[fieldToRemove];

    await testValidationError(invalidData, expectedErrorMessage);
  };

  const removeField = (fieldToRemove: string, baseData: any) => {
    const invalidData = { ...baseData };
    delete invalidData[fieldToRemove];
    return invalidData;
  };

  describe("Successful Doctor DTO creation", () => {
    it("Should return a Doctor DTO with doctor data", () => {
      const [error, dto] = DoctorDTO.validate(VALID_DOCTOR_DATA);

      expect(error).toBe(null);
      expect(dto).not.toBe(null);
      expect(dto).toBeInstanceOf(DoctorDTO);

      expect(dto!.name).toEqual(VALID_DOCTOR_DATA.name);
      expect(dto!.specialty).toEqual(VALID_DOCTOR_DATA.specialty);
      expect(dto!.email).toEqual(VALID_DOCTOR_DATA.email);
      expect(dto!.phone).toEqual(VALID_DOCTOR_DATA.phone);

      expect(
        mockValidationHelper.isValidMedicalSpecialty
      ).toHaveBeenNthCalledWith(1, VALID_DOCTOR_DATA.specialty);
      expect(mockValidationHelper.validateEmail).toHaveBeenNthCalledWith(
        1,
        VALID_DOCTOR_DATA.email
      );
      expect(mockValidationHelper.validatePhone).toHaveBeenNthCalledWith(
        1,
        VALID_DOCTOR_DATA.phone
      );
    });

    it("Should return a Doctor DTO with doctor and ID data", () => {
      mockValidationHelper.validateEntityID.mockReturnValue(null);
      const [error, dto] = DoctorDTO.validate(VALID_DOCTOR_DATA_WITH_ID);

      expect(error).toBe(null);
      expect(dto).not.toBe(null);
      expect(dto).toBeInstanceOf(DoctorDTO);

      expect(dto!.id).toEqual(VALID_DOCTOR_DATA_WITH_ID.id);
      expect(dto!.name).toEqual(VALID_DOCTOR_DATA_WITH_ID.name);
      expect(dto!.specialty).toEqual(VALID_DOCTOR_DATA_WITH_ID.specialty);
      expect(dto!.email).toEqual(VALID_DOCTOR_DATA_WITH_ID.email);
      expect(dto!.phone).toEqual(VALID_DOCTOR_DATA_WITH_ID.phone);

      expect(
        mockValidationHelper.isValidMedicalSpecialty
      ).toHaveBeenNthCalledWith(1, VALID_DOCTOR_DATA.specialty);

      expect(mockValidationHelper.validateEmail).toHaveBeenNthCalledWith(
        1,
        VALID_DOCTOR_DATA.email
      );

      expect(mockValidationHelper.validatePhone).toHaveBeenNthCalledWith(
        1,
        VALID_DOCTOR_DATA.phone
      );
    });

    it("Should NOT throw an error when name is missing", async () => {
      const invalidData = removeField("name", VALID_DOCTOR_DATA);
      const [error, dto] = await DoctorDTO.validate(invalidData);

      expect(error).toBe(null);
      expect(dto).not.toBe(null);
      expect(dto).toBeInstanceOf(DoctorDTO);

      expect(dto!.name).toEqual(undefined);
      expect(dto!.specialty).toEqual(VALID_DOCTOR_DATA_WITH_ID.specialty);
      expect(dto!.email).toEqual(VALID_DOCTOR_DATA_WITH_ID.email);
      expect(dto!.phone).toEqual(VALID_DOCTOR_DATA_WITH_ID.phone);

      expect(
        mockValidationHelper.isValidMedicalSpecialty
      ).toHaveBeenNthCalledWith(1, VALID_DOCTOR_DATA.specialty);

      expect(mockValidationHelper.validateEmail).toHaveBeenNthCalledWith(
        1,
        VALID_DOCTOR_DATA.email
      );

      expect(mockValidationHelper.validatePhone).toHaveBeenNthCalledWith(
        1,
        VALID_DOCTOR_DATA.phone
      );
    });

    it("Should NOT throw an error when specialty is missing", async () => {
      const invalidData = removeField("specialty", VALID_DOCTOR_DATA);
      const [error, dto] = await DoctorDTO.validate(invalidData);

      expect(error).toBe(null);
      expect(dto).not.toBe(null);
      expect(dto).toBeInstanceOf(DoctorDTO);

      expect(dto!.name).toEqual(VALID_DOCTOR_DATA.name);
      expect(dto!.specialty).toEqual(undefined);
      expect(dto!.email).toEqual(VALID_DOCTOR_DATA.email);
      expect(dto!.phone).toEqual(VALID_DOCTOR_DATA.phone);

      expect(
        mockValidationHelper.isValidMedicalSpecialty
      ).not.toHaveBeenCalled();

      expect(mockValidationHelper.validateEmail).toHaveBeenNthCalledWith(
        1,
        VALID_DOCTOR_DATA.email
      );

      expect(mockValidationHelper.validatePhone).toHaveBeenNthCalledWith(
        1,
        VALID_DOCTOR_DATA.phone
      );
    });

    it("Should NOT throw an error when email is missing", async () => {
      const invalidData = removeField("email", VALID_DOCTOR_DATA);
      const [error, dto] = await DoctorDTO.validate(invalidData);

      expect(error).toBe(null);
      expect(dto).not.toBe(null);
      expect(dto).toBeInstanceOf(DoctorDTO);

      expect(dto!.name).toEqual(VALID_DOCTOR_DATA_WITH_ID.name);
      expect(dto!.specialty).toEqual(VALID_DOCTOR_DATA_WITH_ID.specialty);
      expect(dto!.email).toEqual(undefined);
      expect(dto!.phone).toEqual(VALID_DOCTOR_DATA_WITH_ID.phone);

      expect(
        mockValidationHelper.isValidMedicalSpecialty
      ).toHaveBeenNthCalledWith(1, VALID_DOCTOR_DATA.specialty);

      expect(mockValidationHelper.validateEmail).not.toHaveBeenCalled();

      expect(mockValidationHelper.validatePhone).toHaveBeenNthCalledWith(
        1,
        VALID_DOCTOR_DATA.phone
      );
    });

    it("Should NOT throw an error when phone is missing", async () => {
      const invalidData = removeField("phone", VALID_DOCTOR_DATA);
      const [error, dto] = await DoctorDTO.validate(invalidData);

      expect(error).toBe(null);
      expect(dto).not.toBe(null);
      expect(dto).toBeInstanceOf(DoctorDTO);

      expect(dto!.name).toEqual(VALID_DOCTOR_DATA.name);
      expect(dto!.specialty).toEqual(VALID_DOCTOR_DATA_WITH_ID.specialty);
      expect(dto!.email).toEqual(VALID_DOCTOR_DATA_WITH_ID.email);
      expect(dto!.phone).toEqual(undefined);

      expect(
        mockValidationHelper.isValidMedicalSpecialty
      ).toHaveBeenNthCalledWith(1, VALID_DOCTOR_DATA.specialty);

      expect(mockValidationHelper.validateEmail).toHaveBeenNthCalledWith(
        1,
        VALID_DOCTOR_DATA.email
      );

      expect(mockValidationHelper.validatePhone).not.toHaveBeenCalled();
    });

    it("Should NOT throw an error when ID is missing", async () => {
      const invalidData = removeField("id", VALID_DOCTOR_DATA);
      const [error, dto] = await DoctorDTO.validate(invalidData);

      expect(error).toBe(null);
      expect(dto).not.toBe(null);
      expect(dto).toBeInstanceOf(DoctorDTO);

      expect(dto!.id).toEqual(undefined);
      expect(dto!.name).toEqual(VALID_DOCTOR_DATA.name);
      expect(dto!.specialty).toEqual(VALID_DOCTOR_DATA_WITH_ID.specialty);
      expect(dto!.email).toEqual(VALID_DOCTOR_DATA_WITH_ID.email);
      expect(dto!.phone).toEqual(VALID_DOCTOR_DATA_WITH_ID.phone);

      expect(
        mockValidationHelper.isValidMedicalSpecialty
      ).toHaveBeenNthCalledWith(1, VALID_DOCTOR_DATA.specialty);

      expect(mockValidationHelper.validateEmail).toHaveBeenNthCalledWith(
        1,
        VALID_DOCTOR_DATA.email
      );

      expect(mockValidationHelper.validatePhone).toHaveBeenNthCalledWith(
        1,
        VALID_DOCTOR_DATA.phone
      );
    });
  });

  describe("Validation errors", () => {
    it("Should return error when email is invalid", () => {
      mockValidationHelper.validateEmail.mockReturnValue(
        "Mocked response: email format is not valid"
      );

      const [error, dto] = DoctorDTO.validate({
        ...VALID_DOCTOR_DATA,
        email: "invalid-email",
      });

      expect(error).toEqual("Mocked response: email format is not valid");
      expect(dto).not.toBeInstanceOf(DoctorDTO);
      expect(dto).toBeNull();
    });

    it("Should return error when phone is invalid", () => {
      mockValidationHelper.validatePhone.mockReturnValue(
        "Mocked response: phone format is not valid"
      );

      const [error, dto] = DoctorDTO.validate({
        ...VALID_DOCTOR_DATA,
        phone: "invalid-phone",
      });

      expect(error).toEqual("Mocked response: phone format is not valid");
      expect(dto).not.toBeInstanceOf(DoctorDTO);
      expect(dto).toBeNull();
    });

    it("Should return error when specialty is invalid", () => {
      mockValidationHelper.isValidMedicalSpecialty.mockReturnValue(
        false
      );

      const [error, dto] = DoctorDTO.validate({
        ...VALID_DOCTOR_DATA,
        specialty: "invalid-specialty",
      });

      expect(error).toEqual("DTO: Specialty must be a valid DoctorSpecialty");
      expect(dto).not.toBeInstanceOf(DoctorDTO);
      expect(dto).toBeNull();
    });

    it("Should throw an error when ID is invalid", () => {
      mockValidationHelper.validateEntityID.mockReturnValue(
        'ID must be a valid ID' );

      const [ error, dto ] = DoctorDTO.validate({
        ...VALID_DOCTOR_DATA,
        id: 'invalid-id',
      });

      expect( error ).toBe( 'ID must be a valid ID' );
      expect( dto ).toBe(null);
      
    })


    it("Should handle empty data", () => {
      const [ error, dto ] = DoctorDTO.validate({
        name: null,
        specialty: null,
        email: null,
        phone: null,
      });

      expect( error ).toBe('At least one field is mandatory');
      expect( dto ).not.toBeInstanceOf( DoctorDTO );
    });

    // it("", () => {

    // });

    // it("", () => {

    // });
  });
});
