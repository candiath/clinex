import { ZodError } from "zod";
import {
  BirthDateSchema,
  DniSchema,
  EmailSchema,
  EntityIDSchema,
  FutureDateSchema,
  MedicalSpecialtySchema,
  PhoneSchema,
  SexSchema,
} from "./dataSchemas.interfaces";

describe("Data Schemas Interfaces", () => {
  describe("EntityID Schemas", () => {
    describe("Success cases", () => {
      it("should validate a correct EntityID", () => {
        const validId = "123";
        // expect(() => EntityIDSchema.parse(validId)).not.toThrow();
        const parsedId = EntityIDSchema.safeParse(validId);
        expect(parsedId.success).toBe(true);
        expect(typeof parsedId.data).toBe("number");
        expect(parsedId.data).toBe(Number(validId));
      });
    });

    describe("Failure cases", () => {
      it("should invalidate a negative EntityID", () => {
        const invalidId = "-45";
        const test = EntityIDSchema.safeParse(invalidId);
        expect(test.success).toBe(false);
        expect(test.error).toBeInstanceOf(ZodError);
        expect(test.error?.issues[0].code).toBe("too_small");
        expect(test.error?.issues[0].message).toBe(
          "ID should be greater than 0"
        );
      });

      it("should invalidate a non-numeric EntityID", () => {
        const invalidId = "abc";
        const test = EntityIDSchema.safeParse(invalidId);
        expect(test.success).toBe(false);
        expect(test.error).toBeInstanceOf(ZodError);
        expect(test.error?.issues[0].code).toBe("invalid_type");
        expect(test.error?.issues[0].message).toBe(
          "Invalid input: expected number, received NaN"
        );
      });
    });
  });

  describe("BirthDate Schema", () => {
    describe("Success cases", () => {
      it("Should accept a valid birth date (past date)", () => {
        const validBirthDate = new Date("2002-02-02");
        const result = BirthDateSchema.safeParse(validBirthDate);
        expect(result.success).toBe(true);
        expect(result.data?.toISOString().startsWith("2002-02-02")).toBe(true);
        expect(result.data).toEqual(validBirthDate);
      });
    });

    describe("Failure cases", () => {
      const invalidBirthDate = "2022-13-13";

      it("Should reject a malformed date", () => {
        const result = BirthDateSchema.safeParse(invalidBirthDate);
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].code).toBe("invalid_type");
        expect(result.error?.issues[0].message).toBe("Cannot parse date");
      });

      it("Should reject invalid date with input reporting", () => {
        const result = BirthDateSchema.safeParse("2022-13-13", {
          reportInput: true,
        });
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].code).toBe("invalid_type");
        expect(result.error?.issues[0].message).toBe("Cannot parse date");
        expect(result.error?.message).toContain(`"input": null`);
      });

      it("Should reject dates in the future", () => {
        const result = BirthDateSchema.safeParse("3000-02-02");

        expect(result.success).toBeFalsy();
        expect(result.error?.issues[0].code).toBe("too_big");
        expect(result.error?.issues[0].message).toBe(
          "Birth date should be in the past"
        );
      });

      it("Should reject dates in the past", () => {
        const result = BirthDateSchema.safeParse("1000-01-01", {
          reportInput: true,
        });
        expect(result.success).toBeFalsy();
        // Input es un Date object después de coerción - TypeScript no lo infiere
        expect(result.error?.issues[0].input).toBeInstanceOf(Date);
        expect((result.error?.issues[0].input as Date).toISOString()).toBe(
          "1000-01-01T00:00:00.000Z"
        );
        expect(result.error?.issues[0].code).toBe("too_small");
        expect(result.error?.issues[0].message).toBe(
          "Birth date is too far in the past"
        );
      });
    });
  });

  describe("Email Schema", () => {
    describe("Success cases", () => {
      it("Should return accept a valid email", () => {
        const validEmail = "mail@example.com";
        const result = EmailSchema.safeParse(validEmail);

        expect(result.success).toBeTruthy();
        expect(result.data).toBe(validEmail);
      });
    });

    describe("Failure cases", () => {
      it("Should reject a number as email address", () => {
        const invalidEmail = 123;
        const result = EmailSchema.safeParse(invalidEmail);

        expect(result.success).toBeFalsy();
        expect(result.error?.issues[0].code).toBe("invalid_type");
        expect(result.error?.issues[0].message).toBe(
          "Invalid input: expected string, received number"
        );

        expect(result.error?.message).toContain(`"expected": "string"`);
        const issue = result.error?.issues[0];
        expect("expected" in issue!).toBe(true);
        expect((issue as any).expected).toBe("string");
      });

      it("Should reject a domain as email address", () => {
        const invalidEmail = "example.com";
        const result = EmailSchema.safeParse(invalidEmail);

        expect(result.success).toBeFalsy();
        expect(result.error?.issues[0].code).toBe("invalid_format");
        expect(result.error?.issues[0].message).toBe(
          "Missing or invalid email"
        );

        expect(result.error?.message).toContain(`"origin": "string"`);
      });
    });
  });

  describe("Medical Specialty Schema", () => {
    describe("Success cases", () => {
      it("Should accept a valid Medical Specialty", () => {
        const validSpecialty = "CARDIOLOGY";
        const result = MedicalSpecialtySchema.safeParse(validSpecialty);

        expect(result.success).toBeTruthy();
        expect(result.data).toEqual(validSpecialty);
      });
    });

    describe("Failure cases", () => {
      it("Should reject a invalid Medical Specialty", () => {
        const invalidData = "DUCK";
        const result = MedicalSpecialtySchema.safeParse(invalidData);

        expect(result.success).toBeFalsy();
        expect(result.error?.issues[0].code).toBe("invalid_value");
        expect(result.error?.issues[0].message).toContain(
          "Invalid option: expected one of"
        );
      });

      it("Should reject a non-string value", () => {
        const invalidData: object = { id: 123 };
        const result = MedicalSpecialtySchema.safeParse(invalidData);

        expect(result.success).toBeFalsy();
        expect(result.error?.issues[0].code).toBe("invalid_value");
        expect(result.error?.issues[0].message).toContain(
          "Invalid option: expected one of"
        );
      });
    });
  });

  describe("Furure Date Schema", () => {
    describe("Success cases", () => {
      it("Should accept a valid future date", () => {
        const validBirthDate = new Date("3003-03-03");
        const result = FutureDateSchema.safeParse(validBirthDate);
        expect(result.success).toBe(true);
        expect(result.data?.toISOString().startsWith("3003-03-03")).toBe(true);
        expect(result.data).toEqual(validBirthDate);
      });
    });

    describe("Failure cases", () => {
      it("Should reject a past date", () => {
        const result = FutureDateSchema.safeParse("2022-02-02", {
          reportInput: true,
        });
        expect(result.success).toBeFalsy();
        expect(result.error?.issues[0].input).toBeInstanceOf(Date);
        expect((result.error?.issues[0].input as Date).toISOString()).toBe(
          "2022-02-02T00:00:00.000Z"
        );
        expect(result.error?.issues[0].code).toBe("too_small");

        //! The ods of this failing are low, but not zero
        expect(result.error?.issues[0].message).toBe(
          `Too small: expected date to be >=${new Date()}`
        );
      });
    });
  });

  describe("Phone Schema", () => {
    describe("Success cases", () => {
      it("Should accept a valid phone in string format", () => {
        const result = PhoneSchema.safeParse("+1 (234) 567-8900");
        expect(result.success).toBe(true);
        expect(result.data).toBe("+1 (234) 567-8900");
      });
      
      it("Should accept a valid phone in number format", () => {
        const result = PhoneSchema.safeParse(12345678900, { reportInput: true });
        expect(result.success).toBe(true);
        expect(result.data).toBe("12345678900");
      });
    });

    describe("Failure cases", () => {

      it('Should reject small phone number', () => {
        const result = PhoneSchema.safeParse(1);
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].code).toBe("invalid_format");
        expect(result.error?.issues[0].message).toBe("Invalid phone number");
      });
      
      it("Should reject unparseable phone string", () => {
        const result = PhoneSchema.safeParse("invalid-phone");
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].code).toBe("invalid_format");
        expect(result.error?.issues[0].message).toBe("Invalid phone number");
      });
    });
  });

  describe("Name Schema", () => {
    test.todo("Name Schema");
  });

  describe("DNI Schema", () => {
    describe("Success cases", () => {
      it("Should accept valid DNI as string", () => {
        const result = DniSchema.safeParse("40000000");

        expect(result.success).toBe(true);
        expect(result.data).toBe("40000000");
      });

      it("Should accept valid DNI as number", () => {
        const result = DniSchema.safeParse(40_000_000);

        expect(result.success).toBe(true);
        expect(result.data).toBe("40000000");
      });
    });

    describe("Failure cases", () => {
      it("Should reject DNI below minimum", () => {
        const result = DniSchema.safeParse(999_999);
        expect(result.success).toBeFalsy();
        expect(result.error?.issues[0].code).toBe("too_small");
        expect(result.error?.issues[0].message).toBe(
          "Too small: expected number to be >=1000000"
        );
      });

      it("Should reject DNI above maximum", () => {
        const result = DniSchema.safeParse(100_000_000);
        expect(result.success).toBeFalsy();
        expect(result.error?.issues[0].code).toBe("too_big");
        expect(result.error?.issues[0].message).toBe(
          "Too big: expected number to be <=99999999"
        );
      });
    });
  });

  describe("Sex schema", () => {
    describe("Success cases", () => {
      it.each(["male", "female", "other", "prefer not to say"])(
        'Should accept valid value: "%s"',
        (validSex) => {
          const result = SexSchema.safeParse(validSex);
          expect(result.success).toBe(true);
        }
      );
    });
    describe("Failure cases", () => {
      it("Should fail with invalid genre", () => {
        const result = SexSchema.safeParse("HELICOPTER HELICOPTER");
        expect(result.success).toBeFalsy();
        expect(result.error?.issues[0].message).toContain(
          "Invalid option: expected one of"
        );
      });
    });

    describe("Schema contract validation", () => {
      /**
       * @note This test is a control to ensure that if in the future
       * new options are added to the SexSchema enum, this test
       * will fail and alert developers to update related logic
       * depending on the possible values of the SexSchema
       */
      it("CONTROL: ensures the posible values are updated", () => {
        const result = SexSchema.safeParse("APACHE HELICOPTERRR");
        expect(result.success).toBeFalsy();

        const issue = result.error!.issues[0];
        expect(issue.code).toBe("invalid_value");

        //? This test works because Zod enum issues includes a
        //? `values` property with the allowed enum values
        //? but TypeScript doesn't type it... So GGS!
        //! The missing property 'values' in ZodIssue type warn 
        //! can be ignored for this specific test case
        expect((issue.values as unknown)).toBeDefined();
        expect((issue.values as unknown)).toEqual([
          "male",
          "female",
          "other",
          "prefer not to say",
        ]);
        // ensure that no extra issues are present
        expect(result.error?.issues[1]).not.toBeDefined();
      });
    });
  });

  describe("Appointment Status Schema", () => {
    test.todo("Appointment validations");
  });
});
