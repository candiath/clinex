export class EntityID {
  private constructor(private readonly id: any) {}

  static create(id: string): EntityID {
    if (Number.isInteger(id)) {
      const intValue = parseInt(id);
      if (!( intValue > 0)) {
        // TODO: review messages
        throw "ID must be a positive integer";
      }
      return new EntityID(intValue);
    }
    throw "ID is not a number";
  }

  getValue() {
    return this.id;
  }
}
