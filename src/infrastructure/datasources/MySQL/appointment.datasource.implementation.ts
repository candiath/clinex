import { MySQLDatabase } from "../../../data/mysql/mysql.init";
import { Appointment } from "../../../domain/entities/appointment.entity";
import { CustomError } from "../../../domain/errors/customError";
import { ValidationHelper } from "../../../domain/helpers/validation.helper";



export class AppointmentMySQLDatasource {
 
  async findById (id: string) {
    try {
      const validationError = ValidationHelper.validateEntityID(id);
      if (validationError) throw CustomError.internalServerError(validationError);

      const [rows] = await MySQLDatabase.pool.execute(
        "SELECT * FROM appointments where id = ?",
        [id]
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
      throw CustomError.internalServerError('Error finding appointment by ID');
    }
  }

  async save (appointment: Appointment) {
    try {
      const [result] = await MySQLDatabase.pool.execute(
        "INSERT INTO appointments (patientId, doctorId, dateTime, status, reason, notes",
        [
          appointment.patientId,
          appointment.doctorId,
          appointment.dateTime,
          appointment.status,
          appointment.reason,
          appointment.notes
        ]
      );

      return result;
    } catch (error) {
      throw CustomError.internalServerError('Error saving appointment');
    }
  }

  async delete (id: string) {
    try {
      const validationError = ValidationHelper.validateEntityID(id);
      if (validationError) throw CustomError.internalServerError(validationError);

      const [result] = await MySQLDatabase.pool.execute(
        "DELETE FROM appointments WHERE id = ?",
        [id]
      );

      return result;
    } catch (error) {
      throw CustomError.internalServerError('Error deleting appointment');
    }
  }

  async update (appointment: Appointment) {
    try {
      const [result] = await MySQLDatabase.pool.execute(
        "UPDATE appointments SET patientId = ?, doctorId = ?, dateTime = ?, status = ?, reason = ?, notes = ? WHERE id = ?",
        [
          appointment.patientId,
          appointment.doctorId,
          appointment.dateTime,
          appointment.status,
          appointment.reason,
          appointment.notes,
          appointment.id
        ]
      );

      return result;
    } catch (error) {
      throw CustomError.internalServerError('Error updating appointment');
    }
  }

  async getAll () {
    // todo: add filtering / pagination
    try {
      const [rows] = await MySQLDatabase.pool.execute("SELECT * FROM appointments");
      const appointments = rows as any[];

      return appointments.map(row => Appointment.fromDatabase(
        row.patientId,
        row.doctorId,
        row.dateTime,
        row.status,
        row.reason,
        row.notes,
        row.id.toString()
      ));
    } catch (error) {
      throw CustomError.internalServerError('Error fetching all appointments');
    }
  }
}