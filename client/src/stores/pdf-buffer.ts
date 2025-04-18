/*
 * Copyright (c) 2025, (Marco Menegazzi, Francesco Venanti)
 * All rights reserved.
 *
 * This source code is licensed under the BSD 3-Clause License found in the
 * LICENSE file in the root directory of this source tree.
 */

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
