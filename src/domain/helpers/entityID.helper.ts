import { EntityID } from "../types/entityID.type";
declare type DatabaseID = number;

export class EntityIDHelper {
  /**
   * Validates if a value is a valid EntityID according to current database type
   * This is the ONLY place in the codebase that knows about ID format requirements
   */
  public static isValidEntityID(value: string | number): string | null {
    if (typeof value === "number") {
      if (this.validateNumber(value)) return null;
    } else {
      if (typeof value === "string") {
        if (value.trim().length > 0) {
          if (this.validateNumber(parseInt(value, 10))) {
            return null;
          }
        }
      }
    }

    return `ID must be a ${this.getFormatDescription()}`;
  }

  private static validateNumber(value: number): boolean {
    if (!isNaN(value) && value > 0) return true;
    return false;
  }

  public static getFormatDescription(): string {
    return "positive integer";
  }

  public static toDatabaseID(value: any): DatabaseID | null {
    if (this.isValidEntityID(value)) return null;
    return typeof value === "string" ? parseInt(value, 10) : value;
  }
}
