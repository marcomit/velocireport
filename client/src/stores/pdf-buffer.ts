import { create } from "zustand";
interface PdfBufferState {
  pdfBuffer: Record<string, number> | null;
  setPdfBuffer: (buffer: Record<string, number> | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
}
const usePdfBuffer = create<PdfBufferState>()((set) => ({
  pdfBuffer: null,
  setPdfBuffer: (buffer) => set({ pdfBuffer: buffer }),
  error: null,
  setError: (error) => set({ error }),
}));

export default usePdfBuffer;
