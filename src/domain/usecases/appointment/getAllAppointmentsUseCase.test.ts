import { Appointment } from "../../entities/appointment.entity";
import { AppointmentRepository } from "../../repositories/appointment.repository";
import { AppointmentRepositoryImplementation } from "../../../infrastructure/repositories/appointment.repository.implementation";
import { GetAllAppointmentsUseCase } from "./getAllAppointmentsUseCase";
import { AppointmentDatasource } from "../../datasources/appointment.datasource";
import { CustomError } from "../../errors/customError";
import { EntityID } from "../../valueObjects/entityID";
import { AppointmentStatus } from "../../valueObjects/appointmentStatus";

jest.mock(
  "../../../infrastructure/repositories/appointment.repository.implementation"
);

describe("GetAllAppointments", () => {
  let getAllAppointmentsUseCase: GetAllAppointmentsUseCase;
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
    getAllAppointmentsUseCase = new GetAllAppointmentsUseCase(mockRepository);
  });

  const VALID_PATIENT_ID1 = EntityID.create("123");
  const VALID_PATIENT_ID2 = EntityID.create("234");
  const VALID_DOCTOR_ID1 = EntityID.create("456");
  const VALID_DOCTOR_ID2 = EntityID.create("567");
  const MOCK_APPOINTMENT_1 = Appointment.create(
    VALID_PATIENT_ID1,
    VALID_DOCTOR_ID1,
    new Date(),
    AppointmentStatus.create("SCHEDULED")
  );

  const MOCK_APPOINTMENT_2 = Appointment.create(
    VALID_PATIENT_ID2,
    VALID_DOCTOR_ID2,
    new Date(),
    AppointmentStatus.create("SCHEDULED")
  );
  const appointmentList = [MOCK_APPOINTMENT_1, MOCK_APPOINTMENT_2];

  describe("Successful operations", () => {
    //todo: ver si getAll necesita data o no
    it("Should return all appointments", async () => {
      mockRepository.getAll.mockResolvedValue(appointmentList);
      const useCase = await getAllAppointmentsUseCase.execute();

      expect(useCase).toBe(appointmentList);
    });

    it("Should return no appointments when there are no one", async () => {
      mockRepository.getAll.mockResolvedValue([]);
      const usecase = await getAllAppointmentsUseCase.execute();

      expect(usecase).toEqual([]);
    });
  });

  describe("Error handling", () => {
    it("Should return an error when repository fails", async () => {
      mockRepository.getAll.mockRejectedValue(
        CustomError.internalServerError()
      );
      try {
        const usecase = await getAllAppointmentsUseCase.execute();
        fail("It should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).statusCode).toBe(500);
      }
    });
  });
});
