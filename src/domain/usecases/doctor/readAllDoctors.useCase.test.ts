import { ReadAllDoctorsUseCase } from "./readAllDoctors.useCase";
import { DoctorRepositoryImplementation } from "../../../infrastructure/repositories/doctor.repository.implementation";
import { DoctorDatasource } from "../../datasources/doctor.datasource";
import { Doctor } from "../../entities/doctor.entity";
import { CustomError } from "../../errors/customError";
import { DoctorSpecialty } from "../../types/doctorSpecialty.type";

jest.mock(
  "../../../infrastructure/repositories/doctor.repository.implementation"
);

describe("ReadAllDoctorsUseCase", () => {
  let readAllDoctorsUseCase: ReadAllDoctorsUseCase;
  let mockRepository: jest.Mocked<DoctorRepositoryImplementation>;
  let mockDatasource: jest.Mocked<DoctorDatasource>;

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
    mockRepository.list = jest.fn();

    readAllDoctorsUseCase = new ReadAllDoctorsUseCase(mockRepository);
  });

  const MOCK_DOCTOR_1 = Doctor.create(
    "Dr. John Smith",
    DoctorSpecialty.CARDIOLOGY,
    "john.smith@clinex.com",
    "123-456-7890",
    "123"
  );

  const MOCK_DOCTOR_2 = Doctor.create(
    "Dr. Jane Doe",
    DoctorSpecialty.DERMATOLOGY,
    "jane.doe@clinex.com",
    "098-765-4321",
    "456"
  );

  const MOCK_DOCTORS_LIST = [MOCK_DOCTOR_1, MOCK_DOCTOR_2];
  const EMPTY_DOCTORS_LIST: Doctor[] = [];


  describe("Successful retrieval", () => {
    it("Should return all doctors when multiple doctors exist", async () => {
      mockRepository.list.mockResolvedValue(MOCK_DOCTORS_LIST);
      const usecase = await readAllDoctorsUseCase.execute(null);

      expect(usecase).toEqual(MOCK_DOCTORS_LIST);
    });
    
    it("Should return empty array when no doctors exist", async () => {
      mockRepository.list.mockResolvedValue(EMPTY_DOCTORS_LIST);
      const usecase = await readAllDoctorsUseCase.execute(null)
      
      expect(usecase).toEqual(EMPTY_DOCTORS_LIST);

    });

  });

  describe("Error handling", () => {
    it("Should throw CustomError when repository throws CustomError", async() => {
      const e = CustomError.internalServerError("Mock error message");
      mockRepository.list.mockRejectedValue(e);

      expect(readAllDoctorsUseCase.execute(null)).rejects.toThrow(e);
    });

    it("Should throw Error when repository throws Error", async() => {
      const e = new Error("Mock error message");
      mockRepository.list.mockRejectedValue(e);

      expect(readAllDoctorsUseCase.execute(null)).rejects.toThrow(e);
    });
    
  });
  describe("Edge cases", () => {
    test.todo("Should handle null data parameter correctly");

    test.todo("Should handle undefined data parameter correctly");
  });
    // it("", () => {});
});