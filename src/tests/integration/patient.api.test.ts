import request from "supertest";
import { config } from "dotenv";
import express from "express";
import { TestServerHelper } from "../helpers/testServer.helper";
import { PatientTestDataFactory } from "../helpers/patient.testData.factory";
import { AppRoutes } from "../../presentation/routes";
import { PatientTestDatabaseHelper } from "../helpers/patientTestDatabase.helper";

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
describe("Patient API Integration Tests", () => {
  let app: express.Application;

  // mock console to reduce noise during tests
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  // Setup: Connect to database and create server
  beforeAll(async () => {
    await PatientTestDatabaseHelper.connect();
    app = TestServerHelper.createTestServer(AppRoutes.routes);
    console.log("🧪 Integration test environment ready");
  });

  // Teardown: Disconnect from database
  afterAll(async () => {
    await PatientTestDatabaseHelper.disconnect();
    TestServerHelper.cleanup();
    console.log("🧹 Integration test environment cleaned up");
  });

  // Clear data between test suites for isolation
  beforeEach(async () => {
    await PatientTestDatabaseHelper.clearPatientsTable();
  });

  describe("POST /api/patients", () => {
    describe("Success cases", () => {
      it("should create a patient with valid data and return 201", async () => {
        const patientData = PatientTestDataFactory.createValidPatient();

        const response = await request(app)
          .post("/api/patients")
          .send(patientData)
          .expect(201);

        // Verify response structure
        expect(response.body).toHaveProperty("data");
        expect(response.body.data).toHaveProperty("patient");
        expect(response.body.data.patient).toHaveProperty("id");
        expect(response.body.data.patient.firstName).toBe(patientData.firstName);
        expect(response.body.data.patient.email).toBe(patientData.email);

        // Verify patient was saved in database
        const savedPatient = await PatientTestDatabaseHelper.getPatientByEmail(patientData.email);
        expect(savedPatient).toBeDefined();
        expect(savedPatient?.first_name).toBe(patientData.firstName);
      });
    });

    describe("Validation errors", () => {
      it("should return 400 when name is missing", async () => {
        const invalidPatient = PatientTestDataFactory.createPatientWithMissingFirstName();

        const response = await request(app)
          .post("/api/patients")
          .send(invalidPatient)
          .expect(400);

        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("error");
      });


    
      it("should return 400 when email format is invalid", async () => {
        const invalidPatient = PatientTestDataFactory.createPatientWithInvalidEmail();

        const response = await request(app)
          .post("/api/patients")
          .send(invalidPatient)
          .expect(400);

        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("error");
      });
    });

  describe("GET /api/patients/:id", () => {
    describe("Success cases", () => {
      it("should get an existing patient by ID and return 200", async () => {
        // Seed a patient in the database
        const patientData = PatientTestDataFactory.createValidPatient();
        const patientId = await PatientTestDatabaseHelper.seedPatient(patientData);

        const response = await request(app)
          .get(`/api/patients/${patientId}`)
          .expect(200);

        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("data");
        // EntityID puede venir serializado de diferentes formas: {id: number}, {value: number}, o number
        const receivedId = response.body.data.id?.id || response.body.data.id?.value || response.body.data.id;
        expect(String(receivedId)).toBe(String(patientId));
        expect(response.body.data.firstName).toBe(patientData.firstName);
        expect(response.body.data.email).toBe(patientData.email);
      });
    });
  });

    describe("Error cases", () => {
      it("should return 404 when patient does not exist", async () => {
        const nonExistentId = 999999;

        const response = await request(app)
          .get(`/api/patients/${nonExistentId}`)
          .expect(404);

        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("error");
      });

      it("should return 400 when ID is invalid", async () => {
        const invalidId = "invalid-id";

        const response = await request(app)
          .get(`/api/patients/${invalidId}`)
          .expect(400);

        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("error");
      });
    });
  });

  describe("GET /api/patients", () => {
    describe("Success cases", () => {
      it("should return all patients with 200 status", async () => {
        // Seed multiple patients
        const patients = PatientTestDataFactory.createValidPatients(3);
        for (const patient of patients) {
          await PatientTestDatabaseHelper.seedPatient(patient);
        }

        const response = await request(app)
          .get("/api/patients")
          .expect(200);

        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("data");
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThanOrEqual(3);
      });

      it("should return empty array when no patients exist", async () => {
        // Clear all patients first
        await PatientTestDatabaseHelper.clearPatientsTable();

        const response = await request(app)
          .get("/api/patients")
          .expect(200);

        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("data");
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBe(0);
      });
    });
  });

  describe("PUT /api/patients/:id", () => {
    describe("Success cases", () => {
      it("should update an existing patient and return 200", async () => {
        // Seed a patient
        const originalData = PatientTestDataFactory.createValidPatient();
        const patientId = await PatientTestDatabaseHelper.seedPatient(originalData);

        // Update data
        const updateData = {
          firstName: "Updated Name",
          email: "updated.email@example.com",
        };

        const response = await request(app)
          .put(`/api/patients/${patientId}`)
          .send(updateData)
          .expect(200);

        expect(response.body).toHaveProperty("success", true);
        expect(response.body.data.firstName).toBe(updateData.firstName);
        expect(response.body.data.email).toBe(updateData.email);

        // Verify update in database
        const updatedPatient = await PatientTestDatabaseHelper.getPatientById(patientId);
        expect(updatedPatient?.first_name).toBe(updateData.firstName);
        expect(updatedPatient?.email).toBe(updateData.email);
      });

      it("should partially update a patient (only firstName)", async () => {
        const originalData = PatientTestDataFactory.createValidPatient();
        const patientId = await PatientTestDatabaseHelper.seedPatient(originalData);

        const updateData = { firstName: "Partially Updated" };

        const response = await request(app)
          .put(`/api/patients/${patientId}`)
          .send(updateData)
          .expect(200);

        expect(response.body.data.firstName).toBe(updateData.firstName);
        // Other fields should remain unchanged
        expect(response.body.data.email).toBe(originalData.email);
      });
    });

    describe("Error cases", () => {
      it("should return 404 when updating non-existent patient", async () => {
        const nonExistentId = 999999;
        const updateData = { firstName: "New Name" };

        const response = await request(app)
          .put(`/api/patients/${nonExistentId}`)
          .send(updateData)
          .expect(404);

        expect(response.body).toHaveProperty("success", false);
      });

      it("should return 400 when update data is invalid", async () => {
        const patientData = PatientTestDataFactory.createValidPatient();
        const patientId = await PatientTestDatabaseHelper.seedPatient(patientData);

        const invalidUpdate = { email: "invalid-email" };

        const response = await request(app)
          .put(`/api/patients/${patientId}`)
          .send(invalidUpdate)
          .expect(400);

        expect(response.body).toHaveProperty("success", false);
      });
    });
  });

  describe("DELETE /api/patients/:id", () => {
    describe("Success cases", () => {
      it("should delete an existing patient and return 200", async () => {
        // Seed a patient
        const patientData = PatientTestDataFactory.createValidPatient();
        const patientId = await PatientTestDatabaseHelper.seedPatient(patientData);

        const response = await request(app)
          .delete(`/api/patients/${patientId}`)
          .expect(200);

        expect(response.body).toHaveProperty("success", true);

        // Verify patient was deleted from database
        const deletedPatient = await PatientTestDatabaseHelper.getPatientById(patientId);
        expect(deletedPatient).toBeNull();
      });
    });

    describe("Error cases", () => {
      it("should return 404 when deleting non-existent patient", async () => {
        const nonExistentId = 999999;

        const response = await request(app)
          .delete(`/api/patients/${nonExistentId}`)
          .expect(404);

        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("error");
      });

      it("should return 400 when ID is invalid", async () => {
        const invalidId = "not-a-number";

        const response = await request(app)
          .delete(`/api/patients/${invalidId}`)
          .expect(400);

        expect(response.body).toHaveProperty("success", false);
      });
    });
  });
});
