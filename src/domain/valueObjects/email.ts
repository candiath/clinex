import { CustomError } from "../errors/customError";

export class Email {
  private constructor(private readonly value: string) {}

  static create(value: any): Email {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw CustomError.badRequest("Email format is not valid");
    }
    return new Email(value);
  }

  getValue(): string {
    return this.value;
  }
}
