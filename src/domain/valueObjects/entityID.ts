import { CustomError } from "../errors/customError";

export class EntityID {
  private constructor(private readonly id: any) {}

  static create(id: string): EntityID {
    const intValue = parseInt(id);

    if (Number.isInteger(intValue)) {
      if (!(intValue > 0)) {
        throw CustomError.badRequest("ID must be a positive integer");
      }
      return new EntityID(intValue);
    }
    throw CustomError.badRequest("ID is not a number");
  }

  getValue() {
    return this.id;
  }
}
