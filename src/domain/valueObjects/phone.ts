export class Phone {
  private constructor(private readonly phone: any) {}

  static create(phone: any): Phone {
    const phoneRegex = /^[\d\s\-\(\)\+\.]{7,20}$/;
    if (!phoneRegex.test(phone)) throw "Phone format is invalid";
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      throw "Phone must have between 7 and 15 digits";
    }
    return new Phone(phone);
  }

  getValue() {
    return this.phone;
  }
}
