import { MySQLDatabase } from "../../../data/mysql/mysql.init";
import { PatientDatasource } from "../../../domain/datasources/patientDatasource";
import { PatientDTO } from "../../../domain/dtos/patient/patient.dto";
import { Patient } from "../../../domain/entities/patient.entity";
import { CustomError } from "../../../domain/errors/customError";

export class PatientMySQLDatasource implements PatientDatasource {
  async findById(id: number): Promise<Patient | null> {
    try {
      const [rows] = await MySQLDatabase.pool.execute(
        "SELECT * FROM patients WHERE id = ?",
        [id]
      );
      const patients = rows as any[];
      if (patients.length === 0) return null;

      const row = patients[0];
      return Patient.fromDatabase(
        row.dni,
        row.first_name,
        row.last_name,
        new Date(row.birth_date),
        row.email || "",
        row.sex,
        row.id.toString()
      );
    } catch (error) {
      throw CustomError.internalServerError(
        "MySQL datasource: error finding patient by ID"
      );
    }
  }

  async findByDni(dni: string): Promise<Patient | null> {
    try {
      const [rows] = await MySQLDatabase.pool.execute(
        "SELECT * FROM patients WHERE dni = ?",
        [dni]
      );

      const patients = rows as any[];
      if (patients.length === 0) return null;

      const row = patients[0];
      return Patient.fromDatabase(
        row.dni,
        row.first_name,
        row.last_name,
        new Date(row.birth_date),
        row.email || "",
        row.sex,
        row.id.toString()
      );
    } catch (error) {
      throw CustomError.internalServerError(
        "MySQL datasource: error finding patient by DNI"
      );
    }
  }

  async save(patient: Patient): Promise<Patient | null> {
    try {
      const [result] = await MySQLDatabase.pool.execute(
        "INSERT INTO patients (dni, first_name, last_name, birth_date, email, sex) VALUES (?, ?, ?, ?, ?, ?)",
        [
          patient.dni,
          patient.firstName,
          patient.lastName,
          patient.birthDate,
          patient.email || "",
          patient.sex,
        ]
      );

      const insertResult = result as any;
      const newId = insertResult.insertId;

      const createdPatient = Patient.fromDatabase(
        patient.dni,
        patient.firstName,
        patient.lastName,
        patient.birthDate,
        patient.email || "",
        patient.sex,
        newId.toString()
      );

      return createdPatient;
    } catch (error: any) {
      // Handle duplicate key error (unique DNI constraint)
      if (error.code === 'ER_DUP_ENTRY') {
        throw CustomError.conflict(`Patient with DNI ${patient.dni} already exists`);
      }
      throw CustomError.internalServerError(
        (error as Error).message || "Error saving patient in MySQL datasource"
      );
    }
  }

  async update(id: number, newPatientData: PatientDTO): Promise<boolean> {
    try {
      const [result] = await MySQLDatabase.pool.execute(
        "UPDATE patients SET dni = ?, first_name = ?, last_name = ?, birth_date = ?, email = ?, sex = ? WHERE id = ?",
        [
          newPatientData.dni,
          newPatientData.firstName,
          newPatientData.lastName,
          newPatientData.birthDate,
          newPatientData.email || "",
          newPatientData.sex,
          id.toString(),
        ]
      );

      const updateResult = result as any;
      return updateResult.affectedRows > 0;
    } catch (error) {
      throw CustomError.internalServerError(
        "MySQL datasource: error updating patient"
      );
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const [result] = await MySQLDatabase.pool.execute(
        "DELETE FROM patients WHERE id = ?",
        [id.toString()]
      );
      const deleteResult = result as any;
      return deleteResult.affectedRows > 0;
    } catch (error) {
      throw CustomError.internalServerError(
        "MySQL datasource: error deleting patient"
      );
    }
  }

  async list(): Promise<Patient[]> {
    try {
      const [rows] = await MySQLDatabase.pool.execute("SELECT * FROM patients");
      const result = rows as any[];
      
      return result.map((row: any) => {
        return Patient.fromDatabase(
          row.dni,
          row.first_name,
          row.last_name,
          new Date(row.birth_date),
          row.email || "",
          row.sex,
          row.id.toString()
        );
      });
    } catch (error) {
      throw CustomError.internalServerError(
        "MySQL datasource: error listing patients"
      );
    }
  }

  async exists(dni: string): Promise<boolean> {
    try {
      const [rows] = await MySQLDatabase.pool.execute(
        "SELECT COUNT(*) as count FROM patients WHERE dni = ?",
        [dni]
      );
      const count = (rows as any[])[0].count;
      return count > 0;
    } catch (error) {
      throw CustomError.internalServerError(
        "MySQL datasource: error checking patient existence"
      );
    }
  }
}
