import { describe, it, expect, vi } from "vitest";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import type { EnvironmentType } from "@/types/pdf/EnvironmentType";
import type { SignVerifierInterface } from "@/services/Sign/SignVerifier";
import { TerminationReportLoader } from "@/modules/termination-report/loader/TerminationReportLoader";

const SIGN_URL = "https://public-api.prozorro.gov.ua/termination_details/documents/sign.p7s?download=1";
const envVars = {} as EnvironmentType;

const signPayload = JSON.stringify({
  data: { reasonType: "disrupted", reason: "r" },
  context: { contract: { contractID: "UA-1", items: [] } },
});

const object = {
  terminationDetails: {
    reasonType: "disrupted",
    documents: [
      { title: "notice.pdf", documentType: "contractNotice", url: "https://x/notice.pdf" },
      { title: "sign.p7s", documentType: "terminationReport", url: SIGN_URL },
    ],
  },
} as any;

const createVerifier = (): SignVerifierInterface => ({
  verify: vi.fn().mockResolvedValue({ data: signPayload, signers: [] }),
});

describe("TerminationReportLoader", () => {
  it("locates the terminationReport signature and splits data / context.contract", async () => {
    const verifier = createVerifier();

    const result = await new TerminationReportLoader(envVars, verifier).load(object, { title: "sign.p7s" });

    expect(verifier.verify).toHaveBeenCalledWith({ signUrl: SIGN_URL }, undefined);
    expect(result).toMatchObject({ url: SIGN_URL, type: PdfTemplateTypes.TERMINATION_REPORT });
    expect(result.file.terminationDetails).toEqual({ reasonType: "disrupted", reason: "r" });
    expect(result.file.contract).toEqual({ contractID: "UA-1", items: [] });
  });

  it("throws when no terminationReport signature is present", async () => {
    const verifier = createVerifier();
    const withoutSign = { terminationDetails: { documents: [{ documentType: "contractNotice", url: "u" }] } } as any;

    await expect(new TerminationReportLoader(envVars, verifier).load(withoutSign, { title: "t" })).rejects.toThrow();
    expect(verifier.verify).not.toHaveBeenCalled();
  });
});
