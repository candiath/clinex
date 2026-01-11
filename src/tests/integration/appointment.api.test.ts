import request from "supertest";
import { config } from "dotenv";
import express from "express";
import { TestServerHelper } from "../helpers/testServer.helper";
import { TestDataFactory } from "../helpers/appointment.testData.factory";
import { AppRoutes } from "../../presentation/routes";
import { TestDatabaseBaseHelper } from "../helpers/testDatabaseBase.helper";
import { AppointmentTestDatabaseHelper } from '../helpers/appointmentTestDatabase.helper'

// Load test environment variables
config({ path: ".env.test" });

/**
 * Integration Tests for Doctor API
 * 
 * Prerequisites:
 * 1. Start test database: docker-compose -f docker-compose.test.yml up -d
 * 2. Wait for database to be ready (health check)
 * 3. Run tests: npm run test:integration
 * 
 * These tests cover the full HTTP -> Controller -> UseCase -> Repository -> Database flow
 */
describe("Appointment API Integration Tests", () => {
  let app: express.Application;

  // mock console to reduce noise during tests
  beforeAll(() => {
    // jest.spyOn(console, 'log').mockImplementation(() => {});
    // jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  // Setup: Connect to database and create server
  beforeAll(async () => {
    await TestDatabaseBaseHelper.connect();
    app = TestServerHelper.createTestServer(AppRoutes.routes);
    console.log("🧪 Integration test environment ready");
  });

  // Teardown: Disconnect from database
  afterAll(async () => {
    await TestDatabaseBaseHelper.disconnect();
    TestServerHelper.cleanup();
    console.log("🧹 Integration test environment cleaned up");
  });

  // Optional: Clear data between test suites for isolation
  // Uncomment if tests are interfering with each other
  // beforeEach(async () => {
  //   await TestDatabaseBaseHelper.clearDoctorsTable();
  // });

  describe("POST /api/appointments", () => {
    describe("Success cases", () => {
      it("should create an appointment with valid data and return 201", async () => {
        const appointmentData = TestDataFactory.createValidAppointment();
        
        const response = await request(app)
          .post("/api/appointments")
          .send(appointmentData)
          .expect(201);

        // Verify response structure
        expect(response!.body).toHaveProperty("data");
        expect(response!.body.data).toHaveProperty("appointment");
        expect(response!.body.data.appointment).toHaveProperty("id");
        expect(response!.body.data.appointment.patientId).toBe(appointmentData.patientId);
        expect(response!.body.data.appointment.doctorId).toBe(appointmentData.doctorId);
        expect(new Date(response!.body.data.appointment.dateTime).toISOString()).toBe(new Date(appointmentData.dateTime).toISOString());
        expect(response!.body.data.appointment.status.value || response!.body.data.appointment.status).toBe(appointmentData.status);
        // Verify appointment was saved in database
        const savedAppointment = await AppointmentTestDatabaseHelper.getAppointmentById(response!.body.data.appointment.id);
        expect(savedAppointment).toBeDefined();
        expect(savedAppointment?.patient_id).toBe(appointmentData.patientId.toString());
      });

      it("should create multiple appointments with different statuses", async () => {
        const appointment1 = TestDataFactory.createValidAppointment({ status: "SCHEDULED" });
        const appointment2 = TestDataFactory.createValidAppointment({ status: "COMPLETED" });

        await request(app).post("/api/appointments").send(appointment1).expect(201);
        await request(app).post("/api/appointments").send(appointment2).expect(201);

        const count = await AppointmentTestDatabaseHelper.getAppointmentCount();
        expect(count).toBeGreaterThanOrEqual(2);
      });
    });

    describe("Validation errors", () => {
      it("should return 400 when PatientId is missing", async () => {
        const invalidAppointment = TestDataFactory.createAppointmentWithMissingPatientId();

        const response = await request(app)
          .post("/api/appointments")
          .send(invalidAppointment)
          .expect(400);

        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("error");
      });

      it("should return 400 when doctorId is missing", async () => {
        const invalidAppointment = TestDataFactory.createAppointmentWithMissingDoctorId();

        const response = await request(app)
          .post("/api/appointments")
          .send(invalidAppointment)
          .expect(400);

        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("error");
      });

      it("should return 400 when Status is invalid", async () => {
        const invalidAppointment = TestDataFactory.createAppointmentWithInvalidStatus();

        const response = await request(app)
          .post("/api/appointments")
          .send(invalidAppointment)
          .expect(400);

        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("error");
      });
    });
  });

  describe("GET /api/appointments/:id", () => {
    describe("Success cases", () => {
      it("should get an existing appointment by ID and return 200", async () => {
        // Seed an appointment in the database
        const appointmentData = TestDataFactory.createValidAppointment();
        const appointmentId = await AppointmentTestDatabaseHelper.seedAppointment(appointmentData);
        const response = await request(app)
          .get(`/api/appointments/${appointmentId}`)
          .expect(200);

        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("data");
        // EntityID puede venir serializado de diferentes formas: {id: number}, {value: number}, o number
        const receivedId = response.body.data.id?.id || response.body.data.id?.value || response.body.data.id;
        expect(receivedId).toBe(appointmentId.toString());
        expect(response.body.data.patientId.toString()).toBe(appointmentData.patientId.toString());
        expect(response.body.data.doctorId.toString()).toBe(appointmentData.doctorId.toString());
      });
    });

    describe("Error cases", () => {
      it("should return 404 when doctor does not exist", async () => {
        const nonExistentId = 999999;

        const response = await request(app)
          .get(`/api/appointments/${nonExistentId}`)
          .expect(404);

        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("error");
      });

      it("should return 400 when ID is invalid", async () => {
        const invalidId = "invalid-id";

        const response = await request(app)
          .get(`/api/appointments/${invalidId}`)
          .expect(400);

        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("error");
      });
    });
  });

  describe("GET /api/appointments", () => {
    describe("Success cases", () => {
      it("should return all appointments with 200 status", async () => {
        // Seed multiple appointments
        const appointments = TestDataFactory.createValidAppointments(3);
        for (const appointment of appointments) {
          await AppointmentTestDatabaseHelper.seedAppointment({
            ...appointment,
            patientId: typeof appointment.patientId === 'string' ? parseInt(appointment.patientId) : appointment.patientId,
            doctorId: typeof appointment.doctorId === 'string' ? parseInt(appointment.doctorId) : appointment.doctorId,
          });
        }

        const response = await request(app)
          .get("/api/appointments")
          .expect(200);

        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("data");
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThanOrEqual(3);
      });

      it("should return empty array when no appointments exist", async () => {
        // Clear all appointments first
        await AppointmentTestDatabaseHelper.clearAppointmentsTable();

        const response = await request(app)
          .get("/api/appointments")
          .expect(200);

        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("data");
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBe(0);
      });
    });
  });

  describe("PUT /api/appointments/:id", () => {
    describe("Success cases", () => {
      it("should update an existing appointment and return 200", async () => {
        // Seed an appointment
        const originalData = TestDataFactory.createValidAppointment();
        const appointmentId = await AppointmentTestDatabaseHelper.seedAppointment(originalData);

        // Update data
        const updateData = {
          patientId: 999,
          doctorId: 888,
          dateTime: new Date("2030-06-15"),
          status: "COMPLETED",
        };

        const response = await request(app)
          .put(`/api/appointments/${appointmentId}`)
          .send(updateData)
          .expect(200);

        expect(response.body).toHaveProperty("success", true);
        expect(response.body.data.patientId).toBe(updateData.patientId);
        expect(response.body.data.doctorId).toBe(updateData.doctorId);

        // Verify update in database
        const updatedAppointment = await AppointmentTestDatabaseHelper.getAppointmentById(appointmentId);
        expect(updatedAppointment?.patient_id).toBe(updateData.patientId.toString());
        expect(updatedAppointment?.doctor_id).toBe(updateData.doctorId.toString());
      });

      it("should partially update a appointment (only doctorId)", async () => {
        const originalData = TestDataFactory.createValidAppointment();
        const appointmentId = await AppointmentTestDatabaseHelper.seedAppointment(originalData);

        const updateData = { 
          patientId: originalData.patientId,
          doctorId: 987,
          dateTime: originalData.dateTime,
          status: originalData.status
        };
        const response = await request(app)
          .put(`/api/appointments/${appointmentId}`)
          .send(updateData)
          .expect(200);

        expect(response.body.data.doctorId).toBe(updateData.doctorId);
        // Other fields should remain unchanged
        expect(response.body.data.patientId).toBe(originalData.patientId);
      });
    });

    describe("Error cases", () => {
      it("should return 404 when updating non-existent appointment", async () => {
        const nonExistentId = 999999;
        const updateData = {
          patientId: 123,
          doctorId: 456,
          dateTime: new Date(),
          status: "SCHEDULED"
        };

        const response = await request(app)
          .put(`/api/appointments/${nonExistentId}`)
          .send(updateData)
          .expect(404);

        expect(response.body).toHaveProperty("success", false);
      });

      it("should return 400 when update data is invalid", async () => {
        const appointmentData = TestDataFactory.createValidAppointment();
        const appointmentId = await AppointmentTestDatabaseHelper.seedAppointment(appointmentData);

        const invalidUpdate = { 
          patientId: 123,
          doctorId: 456,
          dateTime: new Date(),
          status: "INVALID_STATUS"  // Invalid status value
        };

        const response = await request(app)
          .put(`/api/appointments/${appointmentId}`)
          .send(invalidUpdate)
          .expect(400);

        expect(response.body).toHaveProperty("success", false);
      });
    });
  });

  describe("DELETE /api/appointments/:id", () => {
    describe("Success cases", () => {
      it("should delete an existing doctor and return 200", async () => {
        // Seed an appointment
        const appointmentData = TestDataFactory.createValidAppointment();
        const appointmentId = await AppointmentTestDatabaseHelper.seedAppointment(appointmentData);

        const response = await request(app)
          .delete(`/api/appointments/${appointmentId}`)
          .expect(200);

        expect(response.body).toHaveProperty("success", true);

        // Verify appointment was deleted from database
        const deletedAppointment = await AppointmentTestDatabaseHelper.getAppointmentById(appointmentId);
        expect(deletedAppointment).toBeNull();
      });
    });

    describe("Error cases", () => {
      it("should return 404 when deleting non-existent appointment", async () => {
        const nonExistentId = 999999;

        const response = await request(app)
          .delete(`/api/appointments/${nonExistentId}`)
          .expect(404);

        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("error");
      });

      it("should return 400 when ID is invalid", async () => {
        const invalidId = "not-a-number";

        const response = await request(app)
          .delete(`/api/appointments/${invalidId}`)
          .expect(400);

        expect(response.body).toHaveProperty("success", false);
      });
    });
  });
});
