import { EntityIDHelper } from "./entityID.helper";

describe("Entity ID helper", () => {
  const VALID_ID = 12345678;
  const VALID_STRING_ID = "12345678";

  describe("Valid inputs", () => {
    it("Should return null when data is a number", () => {
      const result = EntityIDHelper.isValidEntityID(VALID_ID);
      expect(result).toBe(null);
    });

    it("Should return null when data is a valid string", () => {
      const result = EntityIDHelper.isValidEntityID(VALID_STRING_ID);
      expect(result).toBe(null);
    });
  });

  describe("Invalid inputs", () => {
    it("Should reject negative numbers", () => {
      const result = EntityIDHelper.isValidEntityID(-1);
      expect(result).not.toBe(null);
      expect(result).toBe(
        `ID must be a ${EntityIDHelper.getFormatDescription()}`
      );
    });

    it("Should reject string negative numbers", () => {
      const result = EntityIDHelper.isValidEntityID("-1");
      expect(result).not.toBe(null);
      expect(result).toBe(
        `ID must be a ${EntityIDHelper.getFormatDescription()}`
      );
    });

    it("Should return error when data is an object", () => {
      const result = EntityIDHelper.isValidEntityID({
        value: VALID_ID,
      } as any);
      expect(result).toBe(
        `ID must be a ${EntityIDHelper.getFormatDescription()}`
      );
    });

    it("Should return error when data is null", () => {
      const result = EntityIDHelper.isValidEntityID(null as any);
      expect(result).toBe(
        `ID must be a ${EntityIDHelper.getFormatDescription()}`
      );
    });

    it("Should return error when data is undefined", () => {
      const result = EntityIDHelper.isValidEntityID(undefined as any);
      expect(result).toBe(
        `ID must be a ${EntityIDHelper.getFormatDescription()}`
      );
    });
  });
});
