import { Email } from "../../valueObjects/email";
import { Phone } from "../../valueObjects/phone";
import * as DoctorDTO from "./doctor.dto";
jest.spyOn(Email, 'create');
jest.spyOn(Phone, 'create');

describe("DoctorDTO", () => {
  // const mockValidationHelper = ValidationHelper as jest.Mocked<
  //   typeof ValidationHelper
  // >;

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
  // const testValidationError = async (
  //   invalidData: any,
  //   expectedMessage: string
  // ) => {
  //   await expect(DoctorDTO.validate(invalidData)).rejects.toThrow(
  //     expectedMessage
  //   );
  // };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
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
  // const testMissingFieldError = async (
  //   baseData: any,
  //   fieldToRemove: string,
  //   expectedErrorMessage: any
  // ) => {
  //   const invalidData = { ...baseData };
  //   delete invalidData[fieldToRemove];

  //   await testValidationError(invalidData, expectedErrorMessage);
  // };

  const removeField = (fieldToRemove: string, baseData: {[key: string]: string}) => {
    const invalidData = { ...baseData };
    delete (invalidData)[fieldToRemove];
    return invalidData;
  };

  describe("Successful Doctor DTO creation", () => {
    it("Should return a Doctor DTO with doctor data", () => {
      const returnData = DoctorDTO.validate(VALID_DOCTOR_DATA);



      expect(returnData).not.toBe(null);
      expect(returnData).toBeInstanceOf(Object);

      expect(returnData!.name).toEqual(VALID_DOCTOR_DATA.name);
      expect(returnData!.specialty).toEqual(VALID_DOCTOR_DATA.specialty);
      expect(returnData!.email).toBeDefined();
      expect(returnData!.phone).toBeDefined();

    });

    it("Should NOT throw an error when name is missing", async () => {
      const invalidData = removeField("name", VALID_DOCTOR_DATA);
      const returnData = await DoctorDTO.validate(invalidData);

      expect(returnData).not.toBe(null);
      expect(returnData).toBeInstanceOf(Object);

      expect(returnData!.name).toEqual(undefined);
      expect(returnData!.specialty).toEqual(VALID_DOCTOR_DATA_WITH_ID.specialty);
      expect(returnData!.email).toBeDefined();
      expect(returnData!.phone).toBeDefined();


    });

    it("Should NOT throw an error when specialty is missing", async () => {
      const invalidData = removeField("specialty", VALID_DOCTOR_DATA);
      const returnData = await DoctorDTO.validate(invalidData);

      expect(returnData).not.toBe(null);
      expect(returnData).toBeInstanceOf(Object);
      expect(returnData!.name).toEqual(VALID_DOCTOR_DATA.name);
      expect(returnData!.specialty).toEqual(undefined);
      expect(returnData!.email).toBeDefined();
      expect(returnData!.phone).toBeDefined();

    });

    it("Should NOT throw an error when email is missing", async () => {
      const invalidData = removeField("email", VALID_DOCTOR_DATA);
      const returnData = await DoctorDTO.validate(invalidData);

      expect(returnData).not.toBe(null);
      expect(returnData).toBeInstanceOf(Object);

      expect(returnData!.name).toEqual(VALID_DOCTOR_DATA_WITH_ID.name);
      expect(returnData!.specialty).toEqual(VALID_DOCTOR_DATA_WITH_ID.specialty);
      expect(returnData!.email).toBeUndefined();
      expect(returnData!.phone).toBeDefined();


      // expect(Email.create).not.toHaveBeenCalled();
    });

    it("Should NOT throw an error when phone is missing", async () => {
      const invalidData = removeField("phone", VALID_DOCTOR_DATA);
      const returnData = await DoctorDTO.validate(invalidData);

      expect(returnData).not.toBe(null);
      expect(returnData).toBeInstanceOf(Object);

      expect(returnData!.name).toEqual(VALID_DOCTOR_DATA.name);
      expect(returnData!.specialty).toEqual(VALID_DOCTOR_DATA_WITH_ID.specialty);
      expect(returnData!.email).toBeDefined();
      expect(returnData!.phone).toBeUndefined();

      // expect(Phone.create).not.toHaveBeenCalled();
    });
  });

  describe("Validation errors", () => {
    it("Should return error when email is invalid", () => {
      expect(() => {
        DoctorDTO.validate({
          ...VALID_DOCTOR_DATA,
          email: "invalid-email",
        });
      }).toThrow("Missing or invalid email");
    });

    it("Should return error when phone is invalid", () => {
      expect(()=>{
        DoctorDTO.validate({
        ...VALID_DOCTOR_DATA,
        phone: "phone",
      });
      }).toThrow("Invalid phone number");
    });

    it("Should return error when specialty is invalid", () => {
      expect(() => {
        DoctorDTO.validate({
          ...VALID_DOCTOR_DATA,
          specialty: "invalid-specialty",
        })
      }).toThrow("Invalid option: expected one of");

      // expect(returnData).toBeNull();
    });

    it("Should throw an error when ID is invalid", () => {
      expect(() => {
        DoctorDTO.validateID({
          ...VALID_DOCTOR_DATA,
          id: 'invalid-id',
        });
      }).toThrow("Invalid input: expected number, received NaN");
    });
  });
});