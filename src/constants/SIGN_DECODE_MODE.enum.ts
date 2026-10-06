/**
 * How a `.p7s` file reaches the decryption service.
 *
 * - `URL` — only the document link is sent; the service fetches the file itself.
 * - `FILE` — the browser downloads the file and sends its base64 content. Needed when
 *   the link is not reachable by the service (e.g. local fixtures on the dev server).
 */
export enum SIGN_DECODE_MODE {
  URL = "URL",
  FILE = "FILE",
}
