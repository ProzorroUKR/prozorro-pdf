import { PDF } from "@/services/PDF/PDF";

const signToDoc = new PDF();

if (typeof window !== "undefined") {
  (window as any).signToDoc = signToDoc;
}

export { signToDoc };
