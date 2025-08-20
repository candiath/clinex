export class EntityID {
  // TODO: Se espera que el ID sea string?
  constructor(id: string) {
    if (Number.isInteger(id)) {
      // Validar que sea positivo
      // Validar que sea entero
      if (!(parseInt(id) > 0)) {
        // TODO: review messages
        throw "ID must be a positive integer";
      }
    }
    throw "ID is not a number";
  }
}
