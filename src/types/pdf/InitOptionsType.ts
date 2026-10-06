import type { SIGN_DECODE_MODE } from "@/constants/SIGN_DECODE_MODE.enum";

export type InitOptionsType = {
  /** Sign decoding flow. Defaults to {@link SIGN_DECODE_MODE.URL}. */
  signDecodeMode?: SIGN_DECODE_MODE;
};
