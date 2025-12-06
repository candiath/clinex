import { CustomError } from "../errors/customError";

export class EntityID {
  private constructor(private readonly id: any) {}

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
}
