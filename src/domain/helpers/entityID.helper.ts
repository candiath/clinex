declare type DatabaseID = number;

export class EntityIDHelper {
  /**
   * Validates if a value is a valid EntityID according to current database type
   * This is the ONLY place in the codebase that knows about ID format requirements
   * @deprecated: this doesnt apply anymore due to value-object implementation, some code
   * may still be using this method though
   */
  public static isValidEntityID(value: string | number): string | null {
    throw new Error("isValidEntityID() is deprecated. EntityID value object class should be used instead");
    // if (typeof value === "number") {
    //   if (this.validateNumber(value)) return null;
    // } else {
    //   // console.log(typeof value)
    //   // console.log({value})
    //   if (typeof value === "string") {
    //     if (value.trim().length > 0) {
    //       if (this.validateNumber(parseInt(value, 10))) {
    //         return null;
    //       }
    //     }
    //   }
    }

    // return `ID must be a ${this.getFormatDescription()}`;
  // }

  // private static validateNumber(value: number): boolean {
  //   if (!isNaN(value) && value > 0) return true;
  //   return false;
  // }

  public static getFormatDescription(): string {
    return "positive integer";
  }

  /**
   * Validates if a value is a valid EntityID (early return version)
   * This is a refactored version with early returns for better readability
   */
  // public static isValidEntityIDEarlyReturn(value: string | number): string | null {
  //   // Handle number type
  //   if (typeof value === "number") {
  //     if (this.validateNumber(value)) return null;
  //     return `ID must be a ${this.getFormatDescription()}`;
  //   }

  //   // Handle non-string types
  //   if (typeof value !== "string") {
  //     return `ID must be a ${this.getFormatDescription()}`;
  //   }

  //   // Handle empty strings
  //   if (value.trim().length === 0) {
  //     return `ID must be a ${this.getFormatDescription()}`;
  //   }

  //   // Parse and validate string as number
  //   const parsedValue = parseInt(value, 10);
  //   if (this.validateNumber(parsedValue)) return null;

  //   return `ID must be a ${this.getFormatDescription()}`;
  // }

  /**
   * Validates if a value is a valid EntityID using regex
   * This version uses regular expressions for validation
   */
//   public static isValidEntityIDRegex(value: string | number): string | null {
//     // Convert to string for uniform processing
//     const stringValue = String(value);

//     // Regex pattern for positive integers:
//     // ^ - start of string
//     // [1-9] - first digit must be 1-9 (no leading zeros, excludes 0)
//     // \d* - followed by zero or more digits
//     // $ - end of string
//     const positiveIntegerPattern = /^[1-9]\d*$/;

//     if (positiveIntegerPattern.test(stringValue)) {
//       return null; // Valid
//     }

//     return `ID must be a ${this.getFormatDescription()}`;
//   }

//   public static toDatabaseID(value: any): DatabaseID | null {
//     if (this.isValidEntityID(value)) return null;
//     return typeof value === "string" ? parseInt(value, 10) : value;
//   }
}
