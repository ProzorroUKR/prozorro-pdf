import { describe, it, expect } from "vitest";
import { PROZORRO_PDF_TYPES } from "./PdfTypes";
import { PdfTemplateTypes } from "./PdfTemplateTypes";

const UPPER_SNAKE_CASE = /^[A-Z0-9_]+$/;

describe("exported document-type constant names are UPPER_SNAKE_CASE", () => {
  // The enum values are API wire strings (e.g. PROZORRO_PDF_TYPES.PQ === "pq"), so only the member
  // names follow the UPPER_SNAKE_CASE convention; checking the values would be checking the API contract.
  it("every PROZORRO_PDF_TYPES key matches /^[A-Z0-9_]+$/", () => {
    for (const key of Object.keys(PROZORRO_PDF_TYPES)) {
      expect(key, `PROZORRO_PDF_TYPES key "${key}"`).toMatch(UPPER_SNAKE_CASE);
    }
  });

  it("every PdfTemplateTypes key matches /^[A-Z0-9_]+$/", () => {
    for (const key of Object.keys(PdfTemplateTypes)) {
      expect(key, `PdfTemplateTypes key "${key}"`).toMatch(UPPER_SNAKE_CASE);
    }
  });
});
