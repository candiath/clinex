import { CustomError } from "../errors/customError";
import * as z from "zod";

export class EntityID {
  private constructor(private readonly id: number) {}

  static validate(id: string | number): EntityID {
    const parsed = z.coerce.number().int().positive().safeParse(id);
    if (!parsed.success) {
      throw CustomError.badRequest(
        "ID is not a valid positive integer string",
        { location: "EntityID.validate" }
      );
    }
    return new EntityID(parsed.data);
  }

  

  
  /**
   * @deprecated Use EntityID.validate instead
   */
  static create(id: any): EntityID {
    if (id instanceof EntityID) return id;
    const intValue = parseInt(id);

    if (Number.isInteger(intValue)) {
      if (!(intValue > 0)) {
        throw CustomError.badRequest("ID must be a positive integer");
      }
      return new EntityID(intValue);
    }
    throw CustomError.badRequest("ID is not a number");
  }

  static createOptional(id: string | undefined | null): EntityID | null {
    if (id === undefined || id === null) {
      return null;
    }
    return EntityID.create(id);
  }

  getValue() {
    return this.id;
  }

  toString(): string {
    return this.id.toString();
  }
}
