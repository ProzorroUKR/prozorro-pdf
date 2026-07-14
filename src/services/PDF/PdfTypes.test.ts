import { describe, it, expect } from "vitest";
import { PROZORRO_PDF_TYPES } from "./PdfTypes";
import { PdfTemplateTypes } from "./PdfTemplateTypes";

const UPPER_SNAKE_CASE = /^[A-Z0-9_]+$/;

describe("exported document-type constants are UPPER_SNAKE_CASE", () => {
  it("every PROZORRO_PDF_TYPES value matches /^[A-Z0-9_]+$/", () => {
    for (const value of Object.values(PROZORRO_PDF_TYPES)) {
      expect(value, `PROZORRO_PDF_TYPES value "${value}"`).toMatch(UPPER_SNAKE_CASE);
    }
  });

  it("every PdfTemplateTypes value matches /^[A-Z0-9_]+$/", () => {
    for (const value of Object.values(PdfTemplateTypes)) {
      expect(value, `PdfTemplateTypes value "${value}"`).toMatch(UPPER_SNAKE_CASE);
    }
  });
});
