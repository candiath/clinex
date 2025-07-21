import { EntityID } from "../types/entityID.type";
declare type DatabaseID = number;

export class EntityIDHelper {
  /**
   * Validates if a value is a valid EntityID according to current database type
   * This is the ONLY place in the codebase that knows about ID format requirements
   */
  public static isValidEntityID( value: any ): string | null {

    const strValue = typeof value === 'number' ? value.toString() : value;
    if ( strValue.trim().length === 0 ) return 'ID cannot be empty';
    // Numeric ID format (MySQL/PostgreSQL serial)

    const numericId = parseInt(strValue, 10);
    if (!isNaN(numericId) && numericId > 0 && numericId.toString() === strValue) return null;

    return `ID must be a ${this.getFormatDescription()}.`;

  }

  public static getFormatDescription(): string {
    return 'positive integer';
  }

  public static toDatabaseID( value: any ): DatabaseID | null {
    if ( this.isValidEntityID( value ) ) return null;

    return typeof value === 'string' ? parseInt( value, 10 ) : value;
  }
}