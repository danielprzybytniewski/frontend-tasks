import { vi } from "vitest";
import { decodePesel, isPeselValid } from "@/second-task/utils/pesel";

describe("isPeselValid", () => {
  test("returns true for valid PESEL", () => {
    expect(isPeselValid("88040311892")).toBe(true);
    expect(isPeselValid("64042999928")).toBe(true);
    expect(isPeselValid("97031003029")).toBe(true);
  });

  test("returns false for invalid format", () => {
    expect(isPeselValid("")).toBe(false);
    expect(isPeselValid("abc")).toBe(false);
    expect(isPeselValid("1234567890")).toBe(false);
    expect(isPeselValid("123456789012")).toBe(false);
  });

  test("returns false for invalid checksum", () => {
    expect(isPeselValid("88040311891")).toBe(false);
  });

  test("returns false for invalid date", () => {
    expect(isPeselValid("99023112345")).toBe(false);
    expect(isPeselValid("00222912345")).toBe(false);
  });

  test("returns false when cannot decode century", () => {
    expect(isPeselValid("88139111892")).toBe(false);
    expect(isPeselValid("88150111892")).toBe(false);
  });

  test("returns false for invalid date in leap year February", () => {
    expect(isPeselValid("00023012345")).toBe(false);
  });

  test("returns false for 29 Feb in non-leap year", () => {
    expect(isPeselValid("01022912345")).toBe(false);
  });
});

describe("decodePesel", () => {
  test("returns correct birth date, gender and age", () => {
    const result = decodePesel("88040311892");
    expect(result.gender).toBe("Male");
    expect(result.birthDate).toBe("3.04.1988");
    expect(result.age).toBeGreaterThanOrEqual(36);
    expect(result.age).toBeLessThanOrEqual(37);
  });

  test("returns Female for even gender digit", () => {
    const result = decodePesel("88040311882");
    expect(result.gender).toBe("Female");
  });

  test("decrements age when birthday hasn't occurred yet", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-11-04"));

    const result = decodePesel("00320312345");
    expect(result.birthDate).toBe("3.12.2000");
    expect(result.age).toBe(24);

    vi.useRealTimers();
  });

  test("correctly calculates age when birthday is today", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-11-05"));

    const result = decodePesel("00310514996");
    expect(result.age).toBe(25);

    vi.useRealTimers();
  });
});
