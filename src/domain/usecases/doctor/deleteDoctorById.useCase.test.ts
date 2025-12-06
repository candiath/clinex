import { DoctorRepositoryImplementation } from "../../../infrastructure/repositories/doctor.repository.implementation";
import { DoctorDatasource } from "../../datasources/doctor.datasource";
import { DeleteDoctorByIdUseCase } from "./deleteDoctorById.useCase";
import { CustomError } from "../../errors/customError";
import { ValidationHelper } from "../../helpers/validation.helper";
import { Doctor } from "../../entities/doctor.entity";
import { DoctorSpecialty } from "../../types/doctorSpecialty.type";
import { Email } from "../../valueObjects/email";
import { Phone } from "../../valueObjects/phone";
import { EntityID } from "../../valueObjects/entityID";

jest.mock(
  "../../../infrastructure/repositories/doctor.repository.implementation"
);
jest.mock("../../helpers/validation.helper");

describe("Delete doctor by ID use case", () => {
  let mockRepository: jest.Mocked<DoctorRepositoryImplementation>;
  let mockDatasource: jest.Mocked<DoctorDatasource>;

  let usecase: DeleteDoctorByIdUseCase;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
      emailExists: jest.fn(),
    } as any;

    // mockRepository.list = jest.fn();

    // mockRepository = new DoctorRepositoryImplementation(
    //   mockDatasource
    // ) as jest.Mocked<DoctorRepositoryImplementation>;
    usecase = new DeleteDoctorByIdUseCase(mockRepository);
  });

  const VALID_ID: EntityID = EntityID.create("123");
  const INVALID_ID = "ABC";
  const VALID_DOCTOR: Doctor = Doctor.create(
    "John",
    DoctorSpecialty.CARDIOLOGY,
    Email.create("john@clinex.com"),
    Phone.create("123456789"),
    VALID_ID
  );

  describe("Successful operations", () => {
    it("Should delete doctor successfully with valid ID", async () => {
      mockRepository.findById.mockResolvedValue(VALID_DOCTOR);
      mockRepository.delete.mockResolvedValue(true);

      const result = await usecase.execute(VALID_ID);

      expect(result).toBeTruthy();
      expect(mockRepository.findById).toHaveBeenCalledWith(VALID_DOCTOR.id);
      expect(mockRepository.delete).toHaveBeenCalledWith(VALID_DOCTOR.id);
    });


    it("Should handle empty doctor list", async () => {
      mockRepository.findById.mockResolvedValue(null);
      let result;
      try {
        result = await usecase.execute(VALID_ID.getValue());
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).message).toBe('Doctor not found');
        expect((error as CustomError).statusCode).toBe(404);
        expect(mockRepository.delete).not.toHaveBeenCalled();
      }
    });
  });

  describe("Error handling", () => {
    it("Should throw CustomError when repository search fails", async () => {

      mockRepository.findById.mockRejectedValue(
        CustomError.serviceUnavailable()
      );

      let result;
      try {
        result = await usecase.execute(VALID_ID);
        fail("It should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).statusCode).toBe(503);
      }
      expect(result).toBe(undefined);
      expect(mockRepository.findById).toHaveBeenCalledWith(VALID_ID);
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it("Should throw CustomError when repository deletion fails", async () => {

      mockRepository.findById.mockResolvedValue(VALID_DOCTOR);
      mockRepository.delete.mockRejectedValue(CustomError.serviceUnavailable());

      let result;
      try {
        result = await usecase.execute(VALID_ID);
        fail("It should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).statusCode).toBe(503);
      }
      expect(result).toBe(undefined);
      expect(mockRepository.findById).toHaveBeenCalledWith(VALID_ID);
      expect(mockRepository.delete).toHaveBeenCalledWith(VALID_ID);
    });

    it("Should throw CustomError when repository search throws unknown error", async () => {

      mockRepository.findById.mockRejectedValue(new Error());

      let result;
      try {
        result = await usecase.execute(VALID_ID);
        fail("It should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
      expect(result).toBe(undefined);
      expect(mockRepository.findById).toHaveBeenCalledWith(VALID_ID);
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it("Should throw CustomError when repository deletion throws unknown error", async () => {

      mockRepository.findById.mockResolvedValue(VALID_DOCTOR);
      mockRepository.delete.mockRejectedValue(new Error);

      let result;
      try {
        result = await usecase.execute(VALID_ID);
        fail("It should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
      expect(result).toBe(undefined);
      expect(mockRepository.findById).toHaveBeenCalledWith(VALID_ID);
      expect(mockRepository.delete).toHaveBeenCalledWith(VALID_ID);
    });
  });

  describe("Validations", () => {
    it("Should throw error when ID is invalid", async() => {
      const errorMessageMock = "ID is not a number";

      let result;
      try {
        result = await usecase.execute(INVALID_ID);
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).statusCode).toBe(400);
        expect((error as CustomError).message).toBe(errorMessageMock);
      }
      expect(result).toBeUndefined();
    })
  });
});
