import { EntityID } from "./entityID";


describe('EntityID', () => {
  it('should create a valid EntityID', () => {
    const id = EntityID.create('1');
    expect(id).toBeInstanceOf(EntityID);
  });

  it('should throw an error for invalid ID', () => {
    expect(() => EntityID.create('invalid')).toThrow();
  });
});