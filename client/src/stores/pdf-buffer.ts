import { create } from "zustand";
interface PdfBufferState {
  pdfBuffer: Record<string, number> | null;
  setPdfBuffer: (buffer: Record<string, number> | null) => void;
}
const usePdfBuffer = create<PdfBufferState>()((set) => ({
  pdfBuffer: null,
  setPdfBuffer: (buffer) => set({ pdfBuffer: buffer }),
}));

export default usePdfBuffer;