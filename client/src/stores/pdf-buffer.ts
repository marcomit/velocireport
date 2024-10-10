import { create } from "zustand";
interface PdfBufferState {
  pdfBuffer: Record<string, number> | null;
  setPdfBuffer: (buffer: Record<string, number> | null) => void;
}
export const usePdfBuffer = create<PdfBufferState>()((set) => ({
  pdfBuffer: null,
  setPdfBuffer: (buffer) => set({ pdfBuffer: buffer }),
}));
