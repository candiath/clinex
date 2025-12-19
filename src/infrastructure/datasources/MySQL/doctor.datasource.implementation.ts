import { MySQLDatabase } from "../../../data/mysql/mysql.init";
import { DoctorDatasource } from "../../../domain/datasources/doctor.datasource";
import { Doctor } from "../../../domain/entities/doctor.entity";
import { CustomError } from "../../../domain/errors/customError";
import { EntityID } from "../../../domain/valueObjects/entityID";

export class DoctorMySQLDatasource implements DoctorDatasource {
  async findById(id: EntityID): Promise<Doctor | null> {
    try {
      const [rows] = await MySQLDatabase.pool.execute(
        "SELECT * FROM doctors WHERE id = ?",
        [id.getValue()] // Usar el ID original
      );

      const doctors = rows as any[];
      if (doctors.length === 0) return null;

      const row = doctors[0];
      const doc = Doctor.create(
        row.name,
        row.specialty,
        row.email,
        row.phone,
        EntityID.validate(row.id) // ID va al final
      );
      return doc;
    } catch (error) {
      // console.log({error});
      throw CustomError.internalServerError(
        "MySQL datasource: error finding doctor by ID",
        { location: "DoctorMySQLDatasource.findById" }
      );
    }
  }
  findByEmail(email: string): Promise<Doctor | null> {
    throw new Error("Method not implemented.");
  }

  async save(doctor: Doctor): Promise<Doctor> {
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
        EntityID.validate(newId) // Convertir a string para mantener consistencia
      );

      return createdDoctor;
    } catch (error) {
      throw CustomError.internalServerError(
        (error as Error).message || "Error saving doctor in MySQL datasource"
      );
    }
  }

  async update(id: EntityID, newDoctorData: Doctor): Promise<Doctor> {
    const [result] = await MySQLDatabase.pool.execute(
      "UPDATE doctors SET name = ?, specialty = ?, email = ?, phone = ? WHERE id = ?",
      [
        newDoctorData.name ?? null,
        newDoctorData.specialty ?? null,
        newDoctorData.email ?? null,
        newDoctorData.phone ?? null,
        id.getValue(),
      ]
    );

    const updateResult = result as any;
    if (updateResult.affectedRows === 0) {
      return Promise.reject(
        CustomError.badRequest("No records updated", {
          location: "DoctorMySQLDatasource.update",
        })
      ); // No se actualizó ningún registro
    }
    // return null;
    return Doctor.create(
      newDoctorData.name!,
      newDoctorData.specialty!,
      newDoctorData.email!,
      newDoctorData.phone!,
      id
    );
  }

  async delete(id: EntityID): Promise<boolean> {
    const [result] = await MySQLDatabase.pool.execute(
      "DELETE FROM doctors WHERE id = ?",
      [id.getValue()]
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
