import request from "supertest";
import { config } from "dotenv";
import express from "express";
import { TestServerHelper } from "../helpers/testServer.helper";
import { TestDataFactory } from "../helpers/doctor.testData.factory";
import { AppRoutes } from "../../presentation/routes";
import { DoctorSpecialty } from "../../domain/types/doctorSpecialty.type";
import { TestDatabaseBaseHelper } from "../helpers/testDatabaseBase.helper";
import {DoctorTestDatabaseHelper} from '../helpers/doctorTestDatabase.helper'

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
describe("Doctor API Integration Tests", () => {
  let app: express.Application;

  // mock console to reduce noise during tests
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
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

  describe("POST /api/doctors", () => {
    describe("Success cases", () => {
      it("should create a doctor with valid data and return 201", async () => {
        const doctorData = TestDataFactory.createValidDoctor();

        const response = await request(app)
          .post("/api/doctors")
          .send(doctorData)
          .expect(201);

        // Verify response structure
        expect(response.body).toHaveProperty("doctor");
        expect(response.body.doctor).toHaveProperty("id");
        expect(response.body.doctor.name).toBe(doctorData.name);
        expect(response.body.doctor.specialty).toBe(doctorData.specialty);
        expect(response.body.doctor.email).toBe(doctorData.email);
        expect(response.body.doctor.phone).toBe(doctorData.phone);

        // Verify doctor was saved in database
        const savedDoctor = await DoctorTestDatabaseHelper.getDoctorByEmail(doctorData.email);
        expect(savedDoctor).toBeDefined();
        expect(savedDoctor?.name).toBe(doctorData.name);
      });

      it("should create multiple doctors with different specialties", async () => {
        const doctor1 = TestDataFactory.createValidDoctor({ specialty: DoctorSpecialty.CARDIOLOGY });
        const doctor2 = TestDataFactory.createValidDoctor({ specialty: DoctorSpecialty.NEUROLOGY });

        await request(app).post("/api/doctors").send(doctor1).expect(201);
        await request(app).post("/api/doctors").send(doctor2).expect(201);

        const count = await DoctorTestDatabaseHelper.getDoctorCount();
        expect(count).toBeGreaterThanOrEqual(2);
      });
    });

    describe("Validation errors", () => {
      it("should return 400 when name is missing", async () => {
        const invalidDoctor = TestDataFactory.createDoctorWithMissingName();

        const response = await request(app)
          .post("/api/doctors")
          .send(invalidDoctor)
          .expect(400);

        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("error");
      });

      it("should return 400 when specialty is missing", async () => {
        const invalidDoctor = TestDataFactory.createDoctorWithMissingSpecialty();

        const response = await request(app)
          .post("/api/doctors")
          .send(invalidDoctor)
          .expect(400);

        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("error");
      });

      it("should return 400 when email format is invalid", async () => {
        const invalidDoctor = TestDataFactory.createDoctorWithInvalidEmail();

        const response = await request(app)
          .post("/api/doctors")
          .send(invalidDoctor)
          .expect(400);

        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("error");
      });

      it("should return 400 when specialty is invalid", async () => {
        const invalidDoctor = TestDataFactory.createDoctorWithInvalidSpecialty();

        const response = await request(app)
          .post("/api/doctors")
          .send(invalidDoctor)
          .expect(400);

        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("error");
      });
    });
  });

  describe("GET /api/doctors/:id", () => {
    describe("Success cases", () => {
      it("should get an existing doctor by ID and return 200", async () => {
        // Seed a doctor in the database
        const doctorData = TestDataFactory.createValidDoctor();
        const doctorId = await DoctorTestDatabaseHelper.seedDoctor(doctorData);

        const response = await request(app)
          .get(`/api/doctors/${doctorId}`)
          .expect(200);

        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("data");
        // EntityID puede venir serializado de diferentes formas: {id: number}, {value: number}, o number
        const receivedId = response.body.data.id?.id || response.body.data.id?.value || response.body.data.id;
        expect(receivedId).toBe(doctorId);
        expect(response.body.data.name).toBe(doctorData.name);
        expect(response.body.data.email).toBe(doctorData.email);
      });
    });

    describe("Error cases", () => {
      it("should return 404 when doctor does not exist", async () => {
        const nonExistentId = 999999;

        const response = await request(app)
          .get(`/api/doctors/${nonExistentId}`)
          .expect(404);

        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("error");
      });

      it("should return 400 when ID is invalid", async () => {
        const invalidId = "invalid-id";

        const response = await request(app)
          .get(`/api/doctors/${invalidId}`)
          .expect(400);

        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("error");
      });
    });
  });

  describe("GET /api/doctors", () => {
    describe("Success cases", () => {
      it("should return all doctors with 200 status", async () => {
        // Seed multiple doctors
        const doctors = TestDataFactory.createValidDoctors(3);
        for (const doctor of doctors) {
          await DoctorTestDatabaseHelper.seedDoctor(doctor);
        }

        const response = await request(app)
          .get("/api/doctors")
          .expect(200);

        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("data");
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThanOrEqual(3);
      });

      it("should return empty array when no doctors exist", async () => {
        // Clear all doctors first
        await DoctorTestDatabaseHelper.clearDoctorsTable();

        const response = await request(app)
          .get("/api/doctors")
          .expect(200);

        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("data");
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBe(0);
      });
    });
  });

  describe("PUT /api/doctors/:id", () => {
    describe("Success cases", () => {
      it("should update an existing doctor and return 200", async () => {
        // Seed a doctor
        const originalData = TestDataFactory.createValidDoctor();
        const doctorId = await DoctorTestDatabaseHelper.seedDoctor(originalData);

        // Update data
        const updateData = {
          name: "Dr. Updated Name",
          specialty: DoctorSpecialty.SURGERY,
        };

        const response = await request(app)
          .put(`/api/doctors/${doctorId}`)
          .send(updateData)
          .expect(200);

        expect(response.body).toHaveProperty("success", true);
        expect(response.body.data.name).toBe(updateData.name);
        expect(response.body.data.specialty).toBe(updateData.specialty);

        // Verify update in database
        const updatedDoctor = await DoctorTestDatabaseHelper.getDoctorById(doctorId);
        expect(updatedDoctor?.name).toBe(updateData.name);
        expect(updatedDoctor?.specialty).toBe(updateData.specialty);
      });

      it("should partially update a doctor (only name)", async () => {
        const originalData = TestDataFactory.createValidDoctor();
        const doctorId = await DoctorTestDatabaseHelper.seedDoctor(originalData);

        const updateData = { name: "Dr. Partially Updated" };

        const response = await request(app)
          .put(`/api/doctors/${doctorId}`)
          .send(updateData)
          .expect(200);

        expect(response.body.data.name).toBe(updateData.name);
        // Other fields should remain unchanged
        expect(response.body.data.email).toBe(originalData.email);
      });
    });

    describe("Error cases", () => {
      it("should return 404 when updating non-existent doctor", async () => {
        const nonExistentId = 999999;
        const updateData = { name: "New Name" };

        const response = await request(app)
          .put(`/api/doctors/${nonExistentId}`)
          .send(updateData)
          .expect(404);

        expect(response.body).toHaveProperty("success", false);
      });

      it("should return 400 when update data is invalid", async () => {
        const doctorData = TestDataFactory.createValidDoctor();
        const doctorId = await DoctorTestDatabaseHelper.seedDoctor(doctorData);

        const invalidUpdate = { email: "invalid-email" };

        const response = await request(app)
          .put(`/api/doctors/${doctorId}`)
          .send(invalidUpdate)
          .expect(400);

        expect(response.body).toHaveProperty("success", false);
      });
    });
  });

  describe("DELETE /api/doctors/:id", () => {
    describe("Success cases", () => {
      it("should delete an existing doctor and return 200", async () => {
        // Seed a doctor
        const doctorData = TestDataFactory.createValidDoctor();
        const doctorId = await DoctorTestDatabaseHelper.seedDoctor(doctorData);

        const response = await request(app)
          .delete(`/api/doctors/${doctorId}`)
          .expect(200);

        expect(response.body).toHaveProperty("success", true);

        // Verify doctor was deleted from database
        const deletedDoctor = await DoctorTestDatabaseHelper.getDoctorById(doctorId);
        expect(deletedDoctor).toBeNull();
      });
    });

    describe("Error cases", () => {
      it("should return 404 when deleting non-existent doctor", async () => {
        const nonExistentId = 999999;

        const response = await request(app)
          .delete(`/api/doctors/${nonExistentId}`)
          .expect(404);

        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("error");
      });

      it("should return 400 when ID is invalid", async () => {
        const invalidId = "not-a-number";

        const response = await request(app)
          .delete(`/api/doctors/${invalidId}`)
          .expect(400);

        expect(response.body).toHaveProperty("success", false);
      });
    });
  });
});
