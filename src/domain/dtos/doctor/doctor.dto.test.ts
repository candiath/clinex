import { ValidationHelper } from "../../helpers/validation.helper";
import { Email } from "../../valueObjects/email";
import { EntityID } from "../../valueObjects/entityID";
import { Phone } from "../../valueObjects/phone";
import { DoctorDTO } from "./doctor.dto";

jest.spyOn(Email, 'create');
jest.spyOn(Phone, 'create');

describe("DoctorDTO", () => {
  const mockValidationHelper = ValidationHelper as jest.Mocked<
    typeof ValidationHelper
  >;
  // const mockEmail = Email as jest.Mocked<typeof Email>;
  // const mockPhone = Phone as jest.Mocked<typeof Phone>;
  // const mockEntityID = EntityID as jest.Mocked<typeof EntityID>;

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
    jest.clearAllMocks();
    jest.restoreAllMocks();
    // jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
    jest.spyOn(Email, 'create');
    jest.spyOn(Phone, 'create');

    // mockValidationHelper.isValidMedicalSpecialty.mockReturnValue(true);
    
    // // Mock Email.create to return a mock Email instance
    // (mockEmail.create as jest.Mock) = jest.fn((value) => {
    //   if (value === undefined || value === null) return undefined;
    //   return { getValue: () => value } as unknown as Email;
    // });
    
    // // Mock Phone.create to return a mock Phone instance
    // (mockPhone.create as jest.Mock) = jest.fn((value) => {
    //   if (value === undefined || value === null) return undefined;
    //   return { getValue: () => value } as unknown as Phone;
    // });

    // // Mock EntityID.createOptional to return a mock EntityID instance
    // (mockEntityID.createOptional as jest.Mock) = jest.fn((value) => {
    //   if (value === undefined || value === null) return undefined;
    //   return { getValue: () => value } as unknown as EntityID;
    // });

    // (mockEntityID.create as jest.Mock) = jest.fn((value) => {
    //   return { getValue: () => value } as unknown as EntityID;
    // })

    
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

      // console.log({"DTO: " : dto});

      expect(error).toBe(null);
      expect(dto).not.toBe(null);
      expect(dto).toBeInstanceOf(DoctorDTO);

      expect(dto!.name).toEqual(VALID_DOCTOR_DATA.name);
      expect(dto!.specialty).toEqual(VALID_DOCTOR_DATA.specialty);
      expect(dto!.email).toBeDefined();
      expect(dto!.phone).toBeDefined();

      expect(Email.create).toHaveBeenCalledWith(VALID_DOCTOR_DATA.email);
      expect(Phone.create).toHaveBeenCalledWith(VALID_DOCTOR_DATA.phone);
    });

    it("Should return a Doctor DTO with doctor and ID data", () => {
      // mockEntityID.create.mockReturnValue();
      const [error, dto] = DoctorDTO.validate(VALID_DOCTOR_DATA_WITH_ID);

      expect(error).toBe(null);
      expect(dto).not.toBe(null);
      expect(dto).toBeInstanceOf(DoctorDTO);

      expect(dto!.id).toBeDefined();
      expect(dto!.name).toEqual(VALID_DOCTOR_DATA_WITH_ID.name);
      expect(dto!.specialty).toEqual(VALID_DOCTOR_DATA_WITH_ID.specialty);
      expect(dto!.email).toBeDefined();
      expect(dto!.phone).toBeDefined();


      expect(Email.create).toHaveBeenCalledWith(VALID_DOCTOR_DATA.email);
      expect(Phone.create).toHaveBeenCalledWith(VALID_DOCTOR_DATA.phone);
    });

    it("Should NOT throw an error when name is missing", async () => {
      const invalidData = removeField("name", VALID_DOCTOR_DATA);
      const [error, dto] = await DoctorDTO.validate(invalidData);

      expect(error).toBe(null);
      expect(dto).not.toBe(null);
      expect(dto).toBeInstanceOf(DoctorDTO);

      expect(dto!.name).toEqual(undefined);
      expect(dto!.specialty).toEqual(VALID_DOCTOR_DATA_WITH_ID.specialty);
      expect(dto!.email).toBeDefined();
      expect(dto!.phone).toBeDefined();


      expect(Email.create).toHaveBeenCalledWith(invalidData.email);
      expect(Phone.create).toHaveBeenCalledWith(invalidData.phone);
    });

    it("Should NOT throw an error when specialty is missing", async () => {
      const invalidData = removeField("specialty", VALID_DOCTOR_DATA);
      const [error, dto] = await DoctorDTO.validate(invalidData);

      expect(error).toBe(null);
      expect(dto).not.toBe(null);
      expect(dto).toBeInstanceOf(DoctorDTO);

      expect(dto!.name).toEqual(VALID_DOCTOR_DATA.name);
      expect(dto!.specialty).toEqual(undefined);
      expect(dto!.email).toBeDefined();
      expect(dto!.phone).toBeDefined();

      expect(Email.create).toHaveBeenCalledWith(invalidData.email);
      expect(Phone.create).toHaveBeenCalledWith(invalidData.phone);
    });

    it("Should NOT throw an error when email is missing", async () => {
      const invalidData = removeField("email", VALID_DOCTOR_DATA);
      const [error, dto] = await DoctorDTO.validate(invalidData);

      expect(error).toBe(null);
      expect(dto).not.toBe(null);
      expect(dto).toBeInstanceOf(DoctorDTO);

      expect(dto!.name).toEqual(VALID_DOCTOR_DATA_WITH_ID.name);
      expect(dto!.specialty).toEqual(VALID_DOCTOR_DATA_WITH_ID.specialty);
      expect(dto!.email).toEqual(null);
      expect(dto!.phone).toBeDefined();



      expect(Email.create).not.toHaveBeenCalled();
      expect(Phone.create).toHaveBeenCalledWith(invalidData.phone);
    });

    it("Should NOT throw an error when phone is missing", async () => {
      const invalidData = removeField("phone", VALID_DOCTOR_DATA);
      const [error, dto] = await DoctorDTO.validate(invalidData);

      expect(error).toBe(null);
      expect(dto).not.toBe(null);
      expect(dto).toBeInstanceOf(DoctorDTO);

      expect(dto!.name).toEqual(VALID_DOCTOR_DATA.name);
      expect(dto!.specialty).toEqual(VALID_DOCTOR_DATA_WITH_ID.specialty);
      expect(dto!.email).toBeDefined();
      expect(dto!.phone).toEqual(null);



      expect(Email.create).toHaveBeenCalledWith(invalidData.email);
      expect(Phone.create).not.toHaveBeenCalled();
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
      expect(dto!.email).toBeDefined();
      expect(dto!.phone).toBeDefined();

      // expect(
      //   mockValidationHelper.isValidMedicalSpecialty
      // ).toHaveBeenNthCalledWith(1, VALID_DOCTOR_DATA.specialty);

      expect(Email.create).toHaveBeenCalledWith(VALID_DOCTOR_DATA.email);
      expect(Phone.create).toHaveBeenCalledWith(VALID_DOCTOR_DATA.phone);
    });
  });

  describe("Validation errors", () => {
    it("Should return error when email is invalid", () => {
      
      const [error, dto] = DoctorDTO.validate({
        ...VALID_DOCTOR_DATA,
        email: "invalid-email",
      });

      expect(error).toEqual("Email format is not valid");
      expect(dto).not.toBeInstanceOf(DoctorDTO);
      expect(dto).toBeNull();
    });

    it("Should return error when phone is invalid", () => {
      const [error, dto] = DoctorDTO.validate({
        ...VALID_DOCTOR_DATA,
        phone: "invalid-phone",
      });

      expect(dto).not.toBeInstanceOf(DoctorDTO);
      expect(error).toEqual("Phone format is invalid");
      expect(dto).toBeNull();
    });

    it("Should return error when specialty is invalid", () => {
      const [error, dto] = DoctorDTO.validate({
        ...VALID_DOCTOR_DATA,
        specialty: "invalid-specialty",
      });

      expect(error).toEqual("DTO: Specialty must be a valid DoctorSpecialty");
      expect(dto).not.toBeInstanceOf(DoctorDTO);
      expect(dto).toBeNull();
    });

    it("Should throw an error when ID is invalid", () => {
      
      const [ error, dto ] = DoctorDTO.validate({
        ...VALID_DOCTOR_DATA,
        id: 'invalid-id',
      });

      expect( dto ).toBe(null);
      expect( error ).toBe( 'ID is not a number' );
    })
  });
});
