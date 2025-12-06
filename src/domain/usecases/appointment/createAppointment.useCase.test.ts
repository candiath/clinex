import { Appointment } from "../../entities/appointment.entity";
import { AppointmentRepositoryImplementation } from "../../../infrastructure/repositories/appointment.repository.implementation";
import { AppointmentStatus } from "../../types/appointmentStatus.type";
import { AppointmentDatasource } from "../../datasources/appointment.datasource";
import { CustomError } from "../../errors/customError";
import { CreateAppointmentUseCase } from "./createAppointment.useCase";

jest.mock(
  "../../../infrastructure/repositories/appointment.repository.implementation"
);

describe("CreateAppointmentUseCase", () => {
  let createAppointmentUseCase: CreateAppointmentUseCase;
  let mockRepository: jest.Mocked<AppointmentRepositoryImplementation>;
  let mockDatasource: jest.Mocked<AppointmentDatasource>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDatasource = {
      create: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockRepository = new AppointmentRepositoryImplementation(
      mockDatasource
    ) as jest.Mocked<AppointmentRepositoryImplementation>;
    createAppointmentUseCase = new CreateAppointmentUseCase(mockRepository);
  });

  const VALID_PATIENT_ID = "123";
  const VALID_DOCTOR_ID = "456";

  const VALID_APPOINTMENT_DATA = {
    patientId: VALID_PATIENT_ID,
    doctorId: VALID_DOCTOR_ID,
    dateTime: new Date("2025-12-31 12:34:56"),
    reason: '',
    notes: '',
  }

  const APPOINTMENT = Appointment.create();

  describe("Successful operations", () => {
    //todo: ver si getAll necesita data o no
    it("Should return all appointments", async () => {
      mockRepository.create.mockResolvedValue(appointmentList);
      const useCase = await createAppointmentUseCase.execute();

      expect(useCase).toBe(appointmentList);
    });

    it("Should return no appointments when there are no one", async () => {
      mockRepository.getAll.mockResolvedValue([]);
      const usecase = await createAppointmentUseCase.execute();

      expect(usecase).toEqual([]);
    });
  });

  describe("Error handling", () => {
    it("Should return an error when repository fails", async () => {
      mockRepository.getAll.mockRejectedValue(
        CustomError.internalServerError()
      );
      try {
        const usecase = await createAppointmentUseCase.execute();
        fail("It should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).statusCode).toBe(500);
      }
    });
  });
});
