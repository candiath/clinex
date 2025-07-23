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
      const validationError = EntityIDHelper.isValidEntityID(id);
      if (validationError) return null; // ID inválido, retornar null

      const [rows] = await MySQLDatabase.pool.execute(
        "SELECT * FROM doctors WHERE id = ?",
        [id] // Usar el ID original
      );

      const doctors = rows as any[];
      if (doctors.length === 0) return null;

      const row = doctors[0];
      const doc = Doctor.create(
        row.name,
        row.specialty,
        row.email,
        row.phone,
        row.id.toString() // ID va al final
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

      const createdDoctor = Doctor.fromDatabase(
        doctor.name,
        doctor.specialty,
        doctor.email,
        doctor.phone,
        newId.toString() // Convertir a string para mantener consistencia
      );

      return createdDoctor;
    } catch (error) {
      throw CustomError.internalServerError((error as Error).message || "Error saving doctor in MySQL datasource");
    }
  }

  async update(id: EntityID, newDoctorData: DoctorDTO): Promise<Doctor | null> {
    const [result] = await MySQLDatabase.pool.execute(
      "UPDATE doctors SET name = ?, specialty = ?, email = ?, phone = ? WHERE id = ?",
      [
        newDoctorData.name,
        newDoctorData.specialty,
        newDoctorData.email,
        newDoctorData.phone,
        id,
      ]
    );

    const updateResult = result as any;
    if (updateResult.affectedRows === 0) {
      return null; // No se actualizó ningún registro
    }
    return Doctor.create(
      newDoctorData.name,
      newDoctorData.specialty,
      newDoctorData.email,
      newDoctorData.phone,
      id
    );
  }

  async delete(id: string): Promise<boolean> {
    const [result] = await MySQLDatabase.pool.execute(
      "DELETE FROM doctors WHERE id = ?",
      [id]
    );
    const deleteResult = result as any;
    return deleteResult.affectedRows > 0; // Retorna true si se eliminó al menos un registro
  }

  async list(): Promise<Doctor[]> {
    const [rows] = await MySQLDatabase.pool.execute("SELECT * FROM doctors");
    const result = rows as any;
    const mapresult = result.map((row: any) => {
      return Doctor.create(
        row.name,
        row.specialty,
        row.email,
        row.phone,
        row.id
      );
    });
    return mapresult;
  }

  async emailExists(email: string): Promise<boolean> {
    const [rows] = await MySQLDatabase.pool.execute(
      "SELECT COUNT(*) as count FROM doctors WHERE email = ?",
      [email]
    );
    const count = (rows as any[])[0].count;
    return count > 0;
  }
}
