import { MySQLDatabase } from "../../../data/mysql/mysql.init";
import { DoctorDatasource } from "../../../domain/datasources/doctor.datasource";
import { DoctorDTO } from "../../../domain/dtos/doctor/doctor.dto";
import { Doctor } from "../../../domain/entities/doctor.entity";
import { CustomError } from "../../../domain/errors/customErrors";
import { EntityIDHelper } from "../../../domain/helpers/entityID.helper";
import { EntityID } from "../../../domain/types/entityID.type";

export class DoctorMySQLDatasource implements DoctorDatasource {
  async findById(id: string): Promise<Doctor | null> {
    try {
      const databaseID = EntityIDHelper.isValidEntityID(id);
      if (databaseID) return Promise.reject(null);

      const [rows] = await MySQLDatabase.pool.execute(
        "SELECT * FROM doctors WHERE id = ?",
        [databaseID]
      );

      const doctors = rows as any[];
      if (doctors.length === 0) return null;

      const row = doctors[0];
      const doc = Doctor.create(
        row.id.toString(),
        row.name,
        row.specialty,
        row.email,
        row.phone
      );
      return doc;
    } catch (error) {
      throw CustomError.internalServerError(
        "MySQL datasource: error finding doctor by ID"
      );
    }
  }
  findByEmail(email: string): Promise<Doctor | null> {
    throw new Error("Method not implemented.");
  }
  async save(doctor: Doctor): Promise<Doctor | null> {
    try {
      console.log("MySQLDatasource: save", doctor);

      const [result] = await MySQLDatabase.pool.execute(
        "INSERT INTO doctors (name, specialty, email, phone) VALUES (?, ?, ?, ?)",
        [
          doctor.name,
          doctor.specialty,
          doctor.email,
          doctor.phone,
          // doctor.isActive ?? true,
        ]
      );

      const insertResult = result as any;
      const newId = insertResult.insertId;

      return Doctor.create(
        doctor.name,
        doctor.specialty,
        doctor.email,
        doctor.phone,
        newId.toString(),
      );
    } catch (error) {
      console.error("MySQLDatasource: Error saving doctor:", error);
      throw error;
    }
  }
  update(id: EntityID, newDoctorData: DoctorDTO): Promise<Doctor | null> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  list(): Promise<Doctor[]> {
    throw new Error("Method not implemented.");
  }
  exists(email: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
