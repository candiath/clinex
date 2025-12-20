import { MySQLDatabase } from "../../../data/mysql/mysql.init";
import { AppointmentDatasource } from "../../../domain/datasources/appointment.datasource";
import { Appointment } from "../../../domain/entities/appointment.entity";
import { CustomError } from "../../../domain/errors/customError";
import { EntityID } from "../../../domain/valueObjects/entityID";

export class AppointmentMySQLDatasource implements AppointmentDatasource {
  async getById(id: EntityID): Promise<Appointment | null> {
    try {
      const [rows] = await MySQLDatabase.pool.execute(
        "SELECT * FROM appointments where id = ?",
        [id.toString()]
      );

      const appointments = rows as any[];
      if (appointments.length === 0) return null;

      const row = appointments[0];
      const appointment = Appointment.fromDatabase(
        row.patientId,
        row.doctorId,
        row.dateTime,
        row.status,
        row.reason,
        row.notes,
        row.id.toString()
      );
      return appointment;
    } catch (error) {
      throw CustomError.internalServerError("Error finding appointment by ID");
    }
  }

  async create(appointment: Appointment): Promise<Appointment> {
    try {
      // todo: enforce timedate format
      // console.log(`INSERT INTO appointments (patientId, doctorId, dateTime, status, reason, notes) VALUES (?, ?, ?, ?, ?, ?)`)
      const [result] = await MySQLDatabase.pool.execute(
        "INSERT INTO appointments (patientId, doctorId, dateTime, status, reason, notes) VALUES (?, ?, ?, ?, ?, ?)",
        [
          appointment.patientId.toString(),
          appointment.doctorId.toString(),
          appointment.dateTime,
          appointment.status.getValue(),
          appointment.reason ?? null,  // ✅ Convertir undefined a null
          appointment.notes ?? null,   // ✅ Convertir undefined a null
        ]
      );

      const createdResult = result as any;
      if (createdResult.affectedRows === 0) {
        throw CustomError.internalServerError(
          "Something went wrong while creating an appointment"
        );
      }

      return Appointment.fromDatabase(
        appointment.patientId,
        appointment.doctorId,
        appointment.dateTime,
        appointment.status,
        appointment.reason ?? '',
        appointment.notes ?? '',
        createdResult.insertId.toString()
      );
    } catch (error) {
      throw CustomError.internalServerError("Error saving appointment");
    }
  }

  async delete(id: EntityID): Promise<boolean> {
    try {
      // const validationError = ValidationHelper.validateEntityID(id);
      // if (validationError)
      //   throw CustomError.internalServerError(validationError);

      // console.log(`DELETE FROM appointments WHERE id = ${id}`);
      const [result] = await MySQLDatabase.pool.execute(
        "DELETE FROM appointments WHERE id = ?",
        [id.toString()]
      );

      const deletedResult = result as any;
      if (deletedResult.affectedRows === 1) {
        return true;
      }

      throw CustomError.internalServerError(
        "Something went wrong while deleting an appointment"
      );
    } catch (error) {
      return false;
      throw CustomError.internalServerError("Error deleting appointment");
    }
  }

  async update(id: EntityID, appointment: Appointment): Promise<Appointment> {
    try {
      // console.log(`UPDATE appointments SET patientId = ?, doctorId = ?, dateTime = ?, status = ?, reason = ?, notes = ? WHERE id = ?`);
      const [result] = await MySQLDatabase.pool.execute(
        "UPDATE appointments SET patientId = ?, doctorId = ?, dateTime = ?, status = ?, reason = ?, notes = ? WHERE id = ?",
        [
          appointment.patientId.toString(),
          appointment.doctorId.toString(),
          appointment.dateTime,
          appointment.status.getValue(),
          appointment.reason ?? null,  // ✅ Convertir undefined a null
          appointment.notes ?? null,   // ✅ Convertir undefined a null
          appointment.id,
        ]
      );

      const updateResult = result as any;
      if (updateResult.affectedRows === 0)
        throw CustomError.internalServerError(
          "Something went wrong while updating an appointment"
        );

      const newAppointment = Appointment.fromDatabase(
        appointment.patientId,
        appointment.doctorId,
        appointment.dateTime,
        appointment.status,
        appointment.reason ?? "",
        appointment.notes ?? "",
        appointment.id!
      );

      return newAppointment;
    } catch (error) {
      throw CustomError.internalServerError("Error updating appointment");
    }
  }

  async getAll(): Promise<Appointment[]> {
    // todo: add filtering / pagination
    try {
      const [rows] = await MySQLDatabase.pool.execute(
        "SELECT * FROM appointments"
      );
      const appointments = rows as any[];

      return appointments.map((row) =>
        Appointment.fromDatabase(
          row.patientId,
          row.doctorId,
          row.dateTime,
          row.status,
          row.reason,
          row.notes,
          row.id.toString()
        )
      );
    } catch (error) {
      throw CustomError.internalServerError("Error fetching all appointments");
    }
  }
}
