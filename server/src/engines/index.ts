import PdfEngine from "./pdf";
import XlsxEngine from "./xlsx";

export * from "./pdf";
export * from "./xlsx";

const engines = {
  pdf: PdfEngine,
  xlsx: XlsxEngine,
} as const;

export { engines };
