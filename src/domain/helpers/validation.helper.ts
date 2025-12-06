import { DoctorSpecialty } from "../types/doctorSpecialty.type";

export class ValidationHelper {


  public static validateUUID ( id: any ): string | null {

    if ( id === undefined ) return 'UUID is undefined';
    if ( typeof id !== 'string' ) return 'UUID must be a string';
    if ( id.trim().length === 0 ) return 'UUID cannot be empty';

    // UUID format (PostgreSQL típico)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(id)) return null;

    return 'UUID must be a valid UUID';
  }

  public static validateEmail ( email: any ): string | null {

    // console.log('Validating email:', email);
    if ( email === undefined ) return 'Email is undefined';
    if ( email === null ) return 'Email cannot be null';
    if ( typeof email !== 'string' ) return 'Email must be a string';
    if ( email.trim().length === 0 ) return 'Email cannot be empty';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Email format is not valid';

    return null;
  }

  public static validatePhone ( phone: any ): string | null {

    if (phone === undefined) return 'Phone is undefined';
    if (typeof phone !== 'string') return 'Phone must be a string';

    if (phone.trim().length === 0) return 'Phone cannot be empty';

    // Solo números y separadores comunes
    const phoneRegex = /^[\d\s\-\(\)\+\.]{7,20}$/;
    if (!phoneRegex.test(phone)) return 'Phone format is invalid';

    // Verificar que tiene al menos 7 dígitos
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      return 'Phone must have between 7 and 15 digits';
    }

    return null;
  }

  public static isValidMedicalSpecialty = ( value: any ): value is DoctorSpecialty => {
    // console.log('Validating DoctorSpecialty:', value);
    return Object.values( DoctorSpecialty ).includes( value );
  }
}