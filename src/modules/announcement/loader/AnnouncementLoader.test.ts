import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ENCODING } from "@/constants/encoding";
import { PdfTemplateTypes } from "@/services/PDF/PdfTemplateTypes";
import type { EnvironmentType } from "@/types/pdf/EnvironmentType";
import { AnnouncementLoader } from "@/modules/announcement/loader/AnnouncementLoader";
import type { SignVerifierInterface } from "@/services/Sign/SignVerifier";

const SIGN_URL = "https://public-api.prozorro.gov.ua/documents/sign.p7s?KeyID=42";
const OLDER_SIGN_URL = "https://public-api.prozorro.gov.ua/documents/older.p7s";

const envVars = {} as EnvironmentType;

const object = {
  documents: [
    { title: "sign.p7s", url: OLDER_SIGN_URL, dateModified: "2026-01-01T00:00:00+02:00" },
    { title: "notice.pdf", url: "https://public-api.prozorro.gov.ua/documents/notice.pdf" },
    { title: "sign.p7s", url: SIGN_URL, dateModified: "2026-01-02T00:00:00+02:00" },
  ],
} as any;

const createVerifier = (): SignVerifierInterface => ({
  verify: vi.fn().mockResolvedValue({ data: JSON.stringify({ data: { id: "tender-1" } }), signers: [] }),
});

describe("AnnouncementLoader", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("hands the verifier the document url verbatim and never downloads the file", async () => {
    const verifier = createVerifier();

    const result = await new AnnouncementLoader(envVars, verifier).load(object, { title: "sign.p7s" });

    expect(verifier.verify).toHaveBeenCalledWith({ signUrl: SIGN_URL }, undefined);
    expect(fetch).not.toHaveBeenCalled();
    expect(result).toMatchObject({ url: SIGN_URL, title: "sign.p7s", type: PdfTemplateTypes.ANNOUNCEMENT });
    expect(result.file).toEqual({ id: "tender-1" });
  });

  it("forwards the configured encoding", async () => {
    const verifier = createVerifier();

    await new AnnouncementLoader(envVars, verifier).load(object, {
      title: "sign.p7s",
      encoding: ENCODING.WINDOWS_1251,
    });

    expect(verifier.verify).toHaveBeenCalledWith({ signUrl: SIGN_URL }, ENCODING.WINDOWS_1251);
  });
});
