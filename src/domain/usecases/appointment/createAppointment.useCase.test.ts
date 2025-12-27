import { Appointment } from "../../entities/appointment.entity";
import { AppointmentRepositoryImplementation } from "../../../infrastructure/repositories/appointment.repository.implementation";
import { AppointmentDatasource } from "../../datasources/appointment.datasource";
import { CustomError } from "../../errors/customError";
import { CreateAppointmentUseCase } from "./createAppointment.useCase";
import { EntityID } from "../../valueObjects/entityID";
import { AppointmentStatus } from "../../valueObjects/appointmentStatus";
import { createAppointmentInput } from "../../interfaces/appointment.interfaces";

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

  const VALID_APPOINTMENT_DATA: createAppointmentInput = {
    patientId: VALID_PATIENT_ID_1,
    doctorId: VALID_DOCTOR_ID_1,
    date: new Date("2025-12-31 12:34:56"),
    status: "SCHEDULED",
  };

  describe("Successful operations", () => {
    test.todo("Should create an appointment successfully");
    test.todo("Should handle optional fields correctly");
  });

  describe("Error handling", () => {
    it("Should return an error when repository fails", async () => {
      mockRepository.create.mockRejectedValue(
        CustomError.internalServerError("MOCKDatabase error")
      );

      try {
        await createAppointmentUseCase.execute(VALID_APPOINTMENT_DATA);
        fail("Should have thrown an error");
      } catch (error) {
        console.log({error});
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).message).toContain(
          "MOCKDatabase error"
        );
        expect((error as CustomError).statusCode).toBe(500);
      }
      expect(mockRepository.create).toHaveBeenCalled();
    });
  });
});
