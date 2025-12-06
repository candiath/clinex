import { Appointment } from "../../entities/appointment.entity";
import { AppointmentRepositoryImplementation } from "../../../infrastructure/repositories/appointment.repository.implementation";
import { AppointmentDatasource } from "../../datasources/appointment.datasource";
import { CustomError } from "../../errors/customError";
import { CreateAppointmentUseCase } from "./createAppointment.useCase";
import { EntityID } from "../../valueObjects/entityID";
import { AppointmentStatus } from "../../valueObjects/appointmentStatus";
import { todo } from "node:test";

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

  const VALID_PATIENT_ID_1 = EntityID.create("123");
  const VALID_DOCTOR_ID_1 = EntityID.create("456");
  const VALID_PATIENT_ID_2 = EntityID.create("234");
  const VALID_DOCTOR_ID_2 = EntityID.create("567");

  const VALID_APPOINTMENT_DATA = {
    patientId: VALID_PATIENT_ID_1,
    doctorId: VALID_DOCTOR_ID_1,
    dateTime: new Date("2025-12-31 12:34:56"),
    reason: '',
    notes: '',
  }

  const APPOINTMENT_1 = Appointment.create(
    VALID_PATIENT_ID_2,
    VALID_DOCTOR_ID_2,
    new Date("2025-12-30 12:34:56"),
    AppointmentStatus.create("SCHEDULED"),
  );
  const APPOINTMENT_2 = Appointment.create(
    VALID_PATIENT_ID_2,
    VALID_DOCTOR_ID_2,
    new Date("2025-12-30 12:34:56"),
    AppointmentStatus.create("SCHEDULED"),
  );



  describe("Successful operations", () => {
    todo("Should create an appointment successfully")
    todo("Should handle optional fields correctly")
  });
    

  describe("Error handling", () => {
    it("Should return an error when repository fails", async () => {
      mockRepository.getAll.mockRejectedValue(
        CustomError.internalServerError()
      );
      try {
        const usecase = await createAppointmentUseCase.execute(VALID_APPOINTMENT_DATA);
        fail("It should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).statusCode).toBe(500);
      }
    });
  });
});
