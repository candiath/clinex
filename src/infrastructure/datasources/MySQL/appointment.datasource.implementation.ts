import { MySQLDatabase } from "../../../data/mysql/mysql.init";
import { Appointment } from "../../../domain/entities/appointment.entity";
import { Doctor } from "../../../domain/entities/doctor.entity";
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
      
    } catch (error) {
      throw CustomError.internalServerError();
    }
  }

  async save (appointment: Appointment) {
    try {
      const [result] = await MySQLDatabase.pool.execute(
        "INSERT INTO appointments (patientId, doctorId, dateTime, status, reason, notes",
        [
          appointment.patientId,
          appointment.doctorId,
          appointment.
        ]
      );


      
    } catch (error) {
      throw CustomError.internalServerError();
    }
  }
}